"""
BML Payment Gateway Service
Handles integration with Bank of Maldives Connect API (transactions-based redirect integration)
"""
import os
import requests
import logging
import hmac
import hashlib
import json
from typing import Dict, Optional, Any
from django.conf import settings
from django.utils import timezone
from decimal import Decimal

logger = logging.getLogger(__name__)

# BML Connect API constants (from bml-connect-php)
BML_API_VERSION = '2.0'
BML_APP_VERSION = 'bml-connect-python'
BML_SIGN_METHOD = 'sha1'

# Minor units per currency (decimal places)
CURRENCY_MINOR_UNITS = {
    'USD': 2,
    'MVR': 2,
    'EUR': 2,
    'GBP': 2,
}


def _to_minor_units(amount: Decimal, currency: str = 'USD') -> int:
    """Convert decimal amount to minor currency units (e.g. 100.00 USD -> 10000)."""
    decimals = CURRENCY_MINOR_UNITS.get(currency.upper(), 2)
    return int(amount * (10 ** decimals))


def _compute_signature(amount: int, currency: str, api_key: str) -> str:
    """Compute BML transaction signature: sha1(amount=X&currency=Y&apiKey=Z)."""
    payload = f'amount={amount}&currency={currency}&apiKey={api_key}'
    return hashlib.sha1(payload.encode('utf-8')).hexdigest()


class BMLPaymentService:
    """Service for interacting with BML Payment Gateway API"""

    def __init__(self):
        self.api_key = os.getenv('BML_API_KEY', '')
        self.app_id = os.getenv('BML_APP_ID', '')
        self.api_base_url = os.getenv(
            'BML_API_BASE_URL',
            'https://api.uat.merchants.bankofmaldives.com.mv/public'
        ).rstrip('/')
        self.webhook_secret = os.getenv('BML_WEBHOOK_SECRET', '')
        self.api_mode = os.getenv('BML_API_MODE', 'transactions')

        if not self.api_key:
            logger.warning("BML_API_KEY not set in environment variables")

    def _get_headers(self) -> Dict[str, str]:
        """Auth header: raw JWT (BML PHP client uses Authorization: <jwt> without Bearer prefix)."""
        headers = {
            'Authorization': self.api_key or '',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if self.app_id:
            headers['X-Application-Id'] = self.app_id
        return headers

    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        url = f"{self.api_base_url}/{endpoint.lstrip('/')}"
        headers = self._get_headers()

        try:
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                json=data if data else None,
                params=params,
                timeout=30
            )
            response.raise_for_status()
            return response.json() if response.content else {}
        except requests.exceptions.RequestException as e:
            logger.error(f"BML API request failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    logger.error(f"BML API error: {e.response.json()}")
                except Exception:
                    logger.error(f"BML API error: {e.response.text}")
            raise Exception(f"BML API request failed: {str(e)}")

    def create_payment_session(
        self,
        amount: Decimal,
        currency: str = 'USD',
        description: str = '',
        customer_name: str = '',
        customer_email: str = '',
        customer_phone: str = '',
        return_url: str = '',
        cancel_url: str = '',
        metadata: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Create a payment session with BML gateway.
        Uses Transactions API: amount in minor units, redirectUrl, signature.
        """
        amount_minor = _to_minor_units(amount, currency)

        if self.api_mode == 'sessions':
            return self._create_session(
                amount_minor, currency, description,
                customer_name, customer_email, customer_phone,
                return_url, cancel_url, metadata
            )
        return self._create_transaction(
            amount_minor, currency, description,
            return_url, cancel_url, metadata
        )

    def _create_transaction(
        self,
        amount_minor: int,
        currency: str,
        description: str,
        return_url: str,
        cancel_url: str,
        metadata: Optional[Dict],
    ) -> Dict[str, Any]:
        """Create transaction via BML /transactions (single redirectUrl)."""
        transaction_id = (metadata or {}).get('transaction_id', '')
        redirect_url = return_url

        transaction_data = {
            'amount': amount_minor,
            'currency': currency,
            'redirectUrl': redirect_url,
            'apiVersion': BML_API_VERSION,
            'appVersion': BML_APP_VERSION,
            'signMethod': BML_SIGN_METHOD,
        }
        if self.app_id:
            transaction_data['appId'] = self.app_id
        if transaction_id:
            transaction_data['localId'] = transaction_id

        transaction_data['signature'] = _compute_signature(
            amount_minor, currency, self.api_key
        )

        response = self._make_request(
            method='POST',
            endpoint='/transactions',
            data=transaction_data
        )

        payment_url = response.get('url') or response.get('paymentUrl')
        bml_id = response.get('id') or response.get('transactionId')

        logger.info(f"Transaction created: {bml_id}")
        return {
            'id': bml_id,
            'sessionId': bml_id,
            'paymentUrl': payment_url,
            'url': payment_url,
            'reference': response.get('reference'),
        }

    def _create_session(
        self,
        amount_minor: int,
        currency: str,
        description: str,
        customer_name: str,
        customer_email: str,
        customer_phone: str,
        return_url: str,
        cancel_url: str,
        metadata: Optional[Dict],
    ) -> Dict[str, Any]:
        """Create session via /sessions (dual successUrl/failureUrl) if supported."""
        session_data = {
            'amount': amount_minor,
            'currency': currency,
            'successUrl': return_url,
            'failureUrl': cancel_url,
            'description': description or 'Payment for travel services',
            'customer': {
                'name': customer_name,
                'email': customer_email,
                'phone': customer_phone,
            },
        }
        if metadata:
            session_data['metadata'] = metadata

        response = self._make_request(
            method='POST',
            endpoint='/sessions',
            data=session_data
        )

        payment_url = response.get('paymentUrl') or response.get('url')
        session_id = response.get('id') or response.get('sessionId')

        logger.info(f"Session created: {session_id}")
        return {
            'id': session_id,
            'sessionId': session_id,
            'paymentUrl': payment_url,
            'url': payment_url,
            'reference': response.get('reference'),
        }

    def get_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Get payment/transaction status from BML API."""
        try:
            response = self._make_request(
                method='GET',
                endpoint=f'/transactions/{payment_id}'
            )
            return response
        except Exception as e:
            try:
                response = self._make_request(
                    method='GET',
                    endpoint=f'/v2/payments/{payment_id}'
                )
                return response
            except Exception:
                logger.error(f"Failed to get payment status: {str(e)}")
                raise

    def _normalize_status(self, raw: str) -> str:
        """Map BML status values to our status enum."""
        s = (raw or '').lower()
        if s in ('completed', 'succeeded', 'paid', 'success'):
            return 'completed'
        if s in ('failed', 'canceled', 'cancelled', 'declined'):
            return 'failed'
        return 'pending'

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify webhook signature (HMAC SHA256)."""
        if not self.webhook_secret:
            logger.warning("BML_WEBHOOK_SECRET not set, skipping verification")
            return True

        try:
            expected = hmac.new(
                self.webhook_secret.encode('utf-8'),
                payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            return hmac.compare_digest(expected, signature)
        except Exception as e:
            logger.error(f"Webhook signature verification error: {str(e)}")
            return False

    def process_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process webhook payload from BML.
        Handles sessions and transactions payload shapes.
        """
        payment_id = (
            payload.get('id') or
            payload.get('paymentId') or
            payload.get('transactionId') or
            payload.get('sessionId')
        )
        reference = (
            payload.get('reference') or
            payload.get('transactionReference') or
            payload.get('merchantReferenceId') or
            payload.get('localId')
        )
        raw_status = (
            payload.get('status') or
            payload.get('paymentStatus') or
            payload.get('transactionStatus') or
            ''
        )
        status_value = self._normalize_status(raw_status)

        webhook_data = {
            'status': status_value,
            'payment_id': payment_id,
            'amount': payload.get('amount'),
            'currency': payload.get('currency', 'USD'),
            'reference': reference,
            'raw_payload': payload,
            'received_at': timezone.now().isoformat(),
        }

        logger.info(f"Processed webhook for {payment_id}: {status_value}")
        return webhook_data

    def create_payment_link(
        self,
        amount: Decimal,
        currency: str = 'USD',
        description: str = '',
        expires_in_days: Optional[int] = None
    ) -> Dict[str, Any]:
        """Placeholder for payment link creation (handled server-side)."""
        from datetime import timedelta
        expires_at = None
        if expires_in_days:
            expires_at = timezone.now() + timedelta(days=expires_in_days)
        return {
            'amount': str(amount),
            'currency': currency,
            'description': description,
            'expires_at': expires_at.isoformat() if expires_at else None,
        }


_bml_service = None


def get_bml_service() -> BMLPaymentService:
    """Get singleton instance of BML payment service."""
    global _bml_service
    if _bml_service is None:
        _bml_service = BMLPaymentService()
    return _bml_service
