"""
BML Payment Gateway Service
Handles integration with Bank of Maldives payment gateway API
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


class BMLPaymentService:
    """Service for interacting with BML Payment Gateway API"""
    
    def __init__(self):
        self.api_key = os.getenv('BML_API_KEY', '')
        self.api_base_url = os.getenv(
            'BML_API_BASE_URL',
            'https://api.uat.merchants.bankofmaldives.com.mv/public'
        )
        self.webhook_secret = os.getenv('BML_WEBHOOK_SECRET', '')
        self.merchant_country = os.getenv('BML_MERCHANT_COUNTRY', 'Maldives')
        
        if not self.api_key:
            logger.warning("BML_API_KEY not set in environment variables")
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    
    def _make_request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict] = None,
        params: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Make a request to BML API
        
        Args:
            method: HTTP method (GET, POST, etc.)
            endpoint: API endpoint (without base URL)
            data: Request body data
            params: Query parameters
            
        Returns:
            Response data as dictionary
            
        Raises:
            Exception: If request fails
        """
        url = f"{self.api_base_url.rstrip('/')}/{endpoint.lstrip('/')}"
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
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"BML API request failed: {str(e)}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    logger.error(f"BML API error response: {error_data}")
                except:
                    logger.error(f"BML API error response: {e.response.text}")
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
        Create a payment session with BML gateway
        
        Args:
            amount: Payment amount
            currency: Currency code (default: USD)
            description: Payment description
            customer_name: Customer name
            customer_email: Customer email
            customer_phone: Customer phone
            return_url: URL to redirect after successful payment
            cancel_url: URL to redirect after cancelled payment
            metadata: Additional metadata
            
        Returns:
            Payment session data including payment URL
        """
        # Prepare payment data according to BML API documentation
        payment_data = {
            'amount': str(amount),
            'currency': currency,
            'description': description or 'Payment for travel services',
            'customer': {
                'name': customer_name,
                'email': customer_email,
                'phone': customer_phone,
            },
            'returnUrl': return_url,
            'cancelUrl': cancel_url,
        }
        
        if metadata:
            payment_data['metadata'] = metadata
        
        try:
            # According to BML documentation, use direct method endpoint
            response = self._make_request(
                method='POST',
                endpoint='/v2/payments',
                data=payment_data
            )
            
            logger.info(f"Payment session created: {response.get('id', 'unknown')}")
            return response
            
        except Exception as e:
            logger.error(f"Failed to create payment session: {str(e)}")
            raise
    
    def get_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """
        Get payment status from BML API
        
        Args:
            payment_id: BML payment ID or reference
            
        Returns:
            Payment status data
        """
        try:
            response = self._make_request(
                method='GET',
                endpoint=f'/v2/payments/{payment_id}'
            )
            return response
        except Exception as e:
            logger.error(f"Failed to get payment status: {str(e)}")
            raise
    
    def verify_webhook_signature(
        self,
        payload: str,
        signature: str
    ) -> bool:
        """
        Verify webhook signature from BML
        
        Args:
            payload: Raw webhook payload (string)
            signature: Signature from webhook header
            secret: Webhook secret key
            
        Returns:
            True if signature is valid, False otherwise
        """
        if not self.webhook_secret:
            logger.warning("BML_WEBHOOK_SECRET not set, skipping signature verification")
            return True  # Allow in development if secret not set
        
        try:
            # BML typically uses HMAC SHA256 for webhook signatures
            expected_signature = hmac.new(
                self.webhook_secret.encode('utf-8'),
                payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Compare signatures (use constant-time comparison to prevent timing attacks)
            return hmac.compare_digest(expected_signature, signature)
            
        except Exception as e:
            logger.error(f"Error verifying webhook signature: {str(e)}")
            return False
    
    def process_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process webhook data from BML
        
        Args:
            payload: Webhook payload data
            
        Returns:
            Processed webhook data
        """
        # Extract payment information from webhook
        payment_status = payload.get('status', '').lower()
        payment_id = payload.get('id') or payload.get('paymentId') or payload.get('transactionId')
        amount = payload.get('amount')
        currency = payload.get('currency', 'USD')
        reference = payload.get('reference') or payload.get('transactionReference')
        
        webhook_data = {
            'status': payment_status,
            'payment_id': payment_id,
            'amount': amount,
            'currency': currency,
            'reference': reference,
            'raw_payload': payload,
            'received_at': timezone.now().isoformat(),
        }
        
        logger.info(f"Processed webhook for payment {payment_id}: {payment_status}")
        return webhook_data
    
    def create_payment_link(
        self,
        amount: Decimal,
        currency: str = 'USD',
        description: str = '',
        expires_in_days: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Create a payment link (if supported by BML API)
        
        Note: This may need to be adapted based on actual BML API capabilities
        
        Args:
            amount: Payment amount
            currency: Currency code
            description: Payment description
            expires_in_days: Number of days until link expires
            
        Returns:
            Payment link data
        """
        # This is a placeholder - actual implementation depends on BML API
        # For now, we'll create the link on our side and use standard payment session
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


# Singleton instance
_bml_service = None


def get_bml_service() -> BMLPaymentService:
    """Get singleton instance of BML payment service"""
    global _bml_service
    if _bml_service is None:
        _bml_service = BMLPaymentService()
    return _bml_service

