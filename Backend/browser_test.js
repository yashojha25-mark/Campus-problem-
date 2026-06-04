const puppeteer = require('puppeteer');

const FRONTEND_URL = 'http://localhost:5174';

async function runBrowserTest() {
  const timestamp = Date.now();
  const username = `user_${timestamp}`;
  const email = `${username}@example.com`;
  const password = 'Password123!';

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // Log page console errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  try {
    // --- STEP 1: SIGN UP ---
    console.log(`\n--- Step 1: Navigating to Signup Page (${FRONTEND_URL}/signup.html) ---`);
    await page.goto(`${FRONTEND_URL}/signup.html`, { waitUntil: 'networkidle2' });

    console.log('Filling out Signup form...');
    await page.type('#name', username);
    await page.type('#email', email);
    await page.type('#password', password);
    await page.type('#passw', password);

    console.log('Clicking Sign Up button...');
    await Promise.all([
      page.click('#sign'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Successfully redirected after signup. Current URL:', page.url());
    if (!page.url().includes('login.html')) {
      throw new Error(`Expected redirection to login.html but got ${page.url()}`);
    }

    // --- STEP 2: LOGIN ---
    console.log('\n--- Step 2: Logging in on Login Page ---');
    console.log('Filling out Login form...');
    await page.type('#email', email);
    await page.type('#password', password);

    console.log('Clicking Login button...');
    await Promise.all([
      page.click('#btn'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    console.log('Successfully logged in. Current URL:', page.url());
    if (!page.url().includes('index.html')) {
      throw new Error(`Expected redirection to index.html but got ${page.url()}`);
    }

    // --- STEP 3: SUBMIT COMPLAINT ---
    console.log(`\n--- Step 3: Navigating to Complain Page (${FRONTEND_URL}/complain.html) ---`);
    await page.goto(`${FRONTEND_URL}/complain.html`, { waitUntil: 'networkidle2' });

    console.log('Opening complaint form modal...');
    await page.click('#openFormBtn');
    await page.waitForSelector('#complaintForm', { visible: true });

    console.log('Filling out complaint details...');
    await page.select('#place', 'Boys hostel');
    await page.waitForSelector('#hostelAreaField select', { visible: true });
    await page.select('#hostelArea', 'Room');
    await page.waitForSelector('#roomField input', { visible: true });
    await page.type('#roomNumber', '305');
    
    await page.select('#problemType', 'Fan not working');
    await page.type('#title', 'Fan noise and low speed');
    await page.type('#description', 'The fan is making a loud clicking noise and running very slow in room 305.');

    console.log('Submitting complaint form...');
    await page.click('.submit-btn');

    console.log('Waiting for complaint card to be rendered on UI...');
    await page.waitForSelector('.complaint-card', { visible: true, timeout: 5000 });

    const cardTitle = await page.evaluate(() => {
      const card = document.querySelector('.complaint-card');
      return card ? card.querySelector('.complaint-title').textContent : null;
    });

    console.log('Complaint successfully saved in database and rendered on frontend!');
    console.log('Rendered Complaint Card Title:', cardTitle);
    if (cardTitle !== 'Fan noise and low speed') {
      throw new Error(`Expected complaint card title 'Fan noise and low speed' but got '${cardTitle}'`);
    }

    // --- STEP 4: SUBMIT FEEDBACK ---
    console.log(`\n--- Step 4: Navigating to Feedback Page (${FRONTEND_URL}/feedback.html) ---`);
    await page.goto(`${FRONTEND_URL}/feedback.html`, { waitUntil: 'networkidle2' });

    console.log('Opening feedback form modal...');
    await page.click('#openFormBtn');
    await page.waitForSelector('#modal', { visible: true });

    console.log('Filling out feedback details...');
    await page.type('#title', 'Speedy Resolution');
    await page.type('#description', 'Great service and quick responses from the complaint management team!');

    console.log('Submitting feedback form...');
    await page.click('#Feedbackform button[type="submit"]');

    console.log('Waiting for feedback card to be rendered on UI...');
    await page.waitForSelector('.feedback-item', { visible: true, timeout: 5000 });

    const feedbackTitle = await page.evaluate(() => {
      const item = document.querySelector('.feedback-item');
      return item ? item.querySelector('h3').textContent : null;
    });

    console.log('Feedback successfully saved in database and rendered on frontend!');
    console.log('Rendered Feedback Card Title:', feedbackTitle);
    if (feedbackTitle !== 'Speedy Resolution') {
      throw new Error(`Expected feedback card title 'Speedy Resolution' but got '${feedbackTitle}'`);
    }

    console.log('\n=========================================');
    console.log('ALL BROWSER FLOW TESTS PASSED SUCCESSFULLY!');
    console.log('=========================================');

  } catch (error) {
    console.error('\nTest failed with error:', error);
  } finally {
    console.log('Closing browser...');
    await browser.close();
  }
}

runBrowserTest();
