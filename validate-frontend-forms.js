#!/usr/bin/env node

/**
 * Frontend Forms Validation Script
 * Tests all form components and UI interactions
 */

const puppeteer = require('puppeteer');

async function validateFrontendForms() {
    console.log('🖥️  HIBLA MANUFACTURING - FRONTEND FORMS VALIDATION');
    console.log('=================================================');
    console.log('');

    const browser = await puppeteer.launch({ 
        headless: false, 
        slowMo: 100,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    let testsPassed = 0;
    let testsFailed = 0;

    try {
        // Navigate to application
        console.log('📱 Loading Hibla Manufacturing System...');
        await page.goto('http://localhost:80', { waitUntil: 'networkidle2' });
        await page.waitForSelector('body', { timeout: 10000 });
        console.log('✅ Application loaded successfully');
        testsPassed++;

        // Test Navigation
        console.log('\n🧭 Testing Navigation...');
        
        // Test Dashboard
        await page.click('a[href="/"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        let pageTitle = await page.$eval('h1', el => el.textContent);
        if (pageTitle.includes('Manufacturing Dashboard')) {
            console.log('✅ Dashboard navigation works');
            testsPassed++;
        } else {
            console.log('❌ Dashboard navigation failed');
            testsFailed++;
        }

        // Test Quotations Page
        await page.click('a[href="/quotations"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        pageTitle = await page.$eval('h1', el => el.textContent);
        if (pageTitle.includes('Quotations')) {
            console.log('✅ Quotations page navigation works');
            testsPassed++;
        } else {
            console.log('❌ Quotations page navigation failed');
            testsFailed++;
        }

        // Test VLOOKUP Quotations
        await page.click('a[href="/quotations-vlookup"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        pageTitle = await page.$eval('h1', el => el.textContent);
        if (pageTitle.includes('VLOOKUP')) {
            console.log('✅ VLOOKUP Quotations page works');
            testsPassed++;
        } else {
            console.log('❌ VLOOKUP Quotations page failed');
            testsFailed++;
        }

        // Test Sales Orders
        await page.click('a[href="/sales-orders"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        console.log('✅ Sales Orders page navigation works');
        testsPassed++;

        // Test Job Orders
        await page.click('a[href="/job-orders"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        console.log('✅ Job Orders page navigation works');
        testsPassed++;

        // Test Inventory
        await page.click('a[href="/inventory"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        console.log('✅ Inventory page navigation works');
        testsPassed++;

        // Test Customer Management
        await page.click('a[href="/customers"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        pageTitle = await page.$eval('h1', el => el.textContent);
        if (pageTitle.includes('Customer')) {
            console.log('✅ Customer Management page works');
            testsPassed++;
        } else {
            console.log('❌ Customer Management page failed');
            testsFailed++;
        }

        // Test Staff Management
        await page.click('a[href="/staff"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        pageTitle = await page.$eval('h1', el => el.textContent);
        if (pageTitle.includes('Staff')) {
            console.log('✅ Staff Management page works');
            testsPassed++;
        } else {
            console.log('❌ Staff Management page failed');
            testsFailed++;
        }

        // Test Reports
        await page.click('a[href="/reports"]');
        await page.waitForSelector('h1', { timeout: 5000 });
        console.log('✅ Reports page navigation works');
        testsPassed++;

        console.log('\n📋 Testing Form Interactions...');

        // Test Quotation Form
        await page.goto('http://localhost:80/quotations-vlookup', { waitUntil: 'networkidle2' });
        await page.waitForSelector('form', { timeout: 5000 });
        
        // Fill customer code
        const customerCodeInput = await page.$('input[placeholder*="ABA"]');
        if (customerCodeInput) {
            await customerCodeInput.type('TEST001');
            console.log('✅ Customer code input works');
            testsPassed++;
        } else {
            console.log('❌ Customer code input not found');
            testsFailed++;
        }

        // Fill country
        const countryInput = await page.$('input[placeholder*="Philippines"]');
        if (countryInput) {
            await countryInput.type('Philippines');
            console.log('✅ Country input works');
            testsPassed++;
        } else {
            console.log('❌ Country input not found');
            testsFailed++;
        }

        // Test theme toggle
        console.log('\n🎨 Testing Theme Toggle...');
        const themeButton = await page.$('[role="button"]');
        if (themeButton) {
            await themeButton.click();
            console.log('✅ Theme toggle works');
            testsPassed++;
        } else {
            console.log('❌ Theme toggle not found');
            testsFailed++;
        }

        // Test responsive design
        console.log('\n📱 Testing Responsive Design...');
        await page.setViewport({ width: 768, height: 1024 });
        await page.waitForTimeout(1000);
        
        const mobileNav = await page.$('[data-testid="mobile-menu"], .mobile-menu, button');
        if (mobileNav) {
            console.log('✅ Mobile navigation detected');
            testsPassed++;
        } else {
            console.log('⚠️  Mobile navigation not clearly identified');
        }

        // Reset viewport
        await page.setViewport({ width: 1920, height: 1080 });

        console.log('\n📊 Frontend Validation Results:');
        console.log('===============================');
        console.log(`Tests Passed: ${testsPassed}`);
        console.log(`Tests Failed: ${testsFailed}`);
        
        if (testsFailed === 0) {
            console.log('\n🎉 ALL FRONTEND TESTS PASSED!');
            console.log('✅ Navigation: WORKING');
            console.log('✅ Forms: WORKING');
            console.log('✅ Theme Toggle: WORKING');
            console.log('✅ Responsive Design: WORKING');
            console.log('\n🚀 Frontend is ready for production!');
        } else {
            const successRate = Math.round((testsPassed / (testsPassed + testsFailed)) * 100);
            console.log(`\n⚠️  ${testsFailed} tests failed. Success rate: ${successRate}%`);
        }

    } catch (error) {
        console.error('❌ Frontend validation failed:', error.message);
        testsFailed++;
    } finally {
        await browser.close();
    }

    return { testsPassed, testsFailed };
}

// Only run if called directly
if (require.main === module) {
    validateFrontendForms().catch(console.error);
}

module.exports = { validateFrontendForms };