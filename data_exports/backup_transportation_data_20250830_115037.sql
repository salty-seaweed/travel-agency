-- Transportation Data Backup
-- Generated on: 2025-08-30 11:50:37
-- 
-- This SQL script creates a backup of all transportation-related tables
-- Run this on your production database to backup transportation data

-- Backup TransferType table
CREATE TABLE IF NOT EXISTS backup_transfer_types_20250830115037 AS 
SELECT * FROM api_transfertype;

-- Backup AtollTransfer table
CREATE TABLE IF NOT EXISTS backup_atoll_transfers_20250830115037 AS 
SELECT * FROM api_atolltransfer;

-- Backup ResortTransfer table
CREATE TABLE IF NOT EXISTS backup_resort_transfers_20250830115037 AS 
SELECT * FROM api_resorttransfer;

-- Backup FerrySchedule table
CREATE TABLE IF NOT EXISTS backup_ferry_schedules_20250830115037 AS 
SELECT * FROM api_ferryschedule;

-- Backup all other transportation tables
CREATE TABLE IF NOT EXISTS backup_transfer_faqs_20250830115037 AS 
SELECT * FROM api_transferfaq;

CREATE TABLE IF NOT EXISTS backup_transfer_contact_methods_20250830115037 AS 
SELECT * FROM api_transfercontactmethod;

CREATE TABLE IF NOT EXISTS backup_transfer_booking_steps_20250830115037 AS 
SELECT * FROM api_transferbookingstep;

CREATE TABLE IF NOT EXISTS backup_transfer_benefits_20250830115037 AS 
SELECT * FROM api_transferbenefit;

CREATE TABLE IF NOT EXISTS backup_transfer_pricing_factors_20250830115037 AS 
SELECT * FROM api_transferpricingfactor;

CREATE TABLE IF NOT EXISTS backup_transfer_content_20250830115037 AS 
SELECT * FROM api_transfercontent;

-- Show backup tables created
SELECT 'Backup completed for transportation data on 2025-08-30 11:50:37' AS status;
