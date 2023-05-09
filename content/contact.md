---
title: "Contact me"
description: "Hugo, the world's fastest framework for building websites"
date: "2022-11-11"
noComment: true
noDate: true
---

<div class="featured-banner">
  <img src="/samurai-logo.svg"
    class="profile-image"
    alt="A samurai mask logo"
    width="140">

  <h2 style="font-style: italic;">Hi, I'm <span style="color: var(--bold-with-gold);">Juan Gómez</span>,<br>
  an experienced full-stack web developer.</h2>
  <p>Feel free to contact me if you have any further questions, project offers,
    you need help to fix an issue with your site or server architecture, I'm open to work per hour.</p>
</div>

<div class="form-container">
  <form
    id="contact-form"
    method="post"
    class="responsive-form"
  >
    <div class="field-container">
      <label for="name">Name*:</label>
      <input type="text" id="name" name="name" required>
    </div>
    <div class="field-container">
      <label for="email">Email*:</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="field-container">
      <label for="subject">Subject*:</label>
      <input type="text" id="subject" name="subject" required>
    </div>
    <div class="field-container">
      <label for="message">Message*:</label>
      <textarea id="message" name="message" rows="10" required></textarea>
    </div>
    <div class="g-recaptcha" data-sitekey="6LfH2-oiAAAAAO8yeRMVEugLESUVWaUe8qUtTNCn"
    aria-label="Please complete the reCAPTCHA to verify that you are not a robot."></div>
    <button type="submit">Send Message</button>
    <br>
    <small>*Required fields</small>
  </form>
</div>

<link href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>

<script>
  // Load reCAPTCHA API script
  var reCaptchaScript = document.createElement('script');
  reCaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
  document.head.appendChild(reCaptchaScript);

  // Add event listener to contact form
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    var recaptchaResponse = grecaptcha.getResponse();

    // Verify reCAPTCHA response
    var response = grecaptcha.getResponse();
    if (!response) {
      Swal.fire({
        icon: 'error',
        title: 'Oh no...',
        text: 'Please complete the reCAPTCHA challenge.'
      });

      return;
    }

    // Set Mailgun API parameters
    var sender = 'JUANING.dev<contact@juaning.dev>';
    var recipient = 'Juan Gómez<contact@juaning.dev>';
    var subject = 'New message from ' + name;
    var body = 'Name: ' + name + '\n\nEmail: ' + email +
      + '\n\nSubject: ' + subject +'\n\nMessage: ' + message;

    // Send form data to Mailgun API
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.mailgun.net/v3/mg.juaning.dev/messages');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('api:' + process.env.MAILGUN_API_KEY));
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {

          Swal.fire({
            icon: 'success',
            title: 'Thank you for reaching out to me!',
            text: 'I appreciate your interest and will personally get back to you as soon as possible.'
          });

          // Clear form fields
          document.getElementById('contact-form').reset();
          grecaptcha.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oh no...',
            text: 'I apologize, but it seems that something went wrong with the submission. I suggest that you try again at a later time.'
          });
        }
      }
    };

    xhr.send(
      'from=' + encodeURIComponent(sender) +
      '&to=' + encodeURIComponent(recipient) +
      '&subject=' + encodeURIComponent(subject) +
      '&text=' + encodeURIComponent(body));
  });

  // Make reCaptcha compliance 508 valid.
  function addAriaLabelToRecaptcha() {
    const recaptchaContainer = document.getElementById('g-recaptcha-response');

    if (recaptchaContainer) {
      recaptchaContainer.setAttribute('aria-label', 'This is a reCAPTCHA reponse');
    }
  }

  // Create a new observer and specify what to observe
  const observer = new MutationObserver(addAriaLabelToRecaptcha);

  // Configure the observer to watch for changes in the target node's child list
  const config = { childList: true };

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
</script>
