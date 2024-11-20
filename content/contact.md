---
title: Contact me
description: "Senior Full Stack Developer with 8+ years experience in CMS, MERN
 stack, and DevOps. Specializing in scalable web solutions, API development,
 and cloud infrastructure. Let's build together!"
date: "2022-11-11"
noComment: true
noDate: true
---

<div class="contact-page">
  <div class="row">
    <div class="col">
      <h2 style="font-style: italic; font-weight: normal;">Hi, I'm <span style="font-weight: bold;">Juan Gómez</span>,<br>
      Senior Full Stack Web Developer based in Cuernavaca, Morelos, Mexico.</h2>
      <p>Feel free to contact me if you have any further questions, project offers,
        you need help to fix an issue with your site or server architecture, I'm open to work per hour.</p>
    </div>
    <div class="col">
      <div class="form-container">
        <form
          id="contact-form"
          method="post"
          class="responsive-form en"
        >
          <div class="field-container">
            <input type="text" id="name" name="name" placeholder="Name" required>
            <label for="name">Name</label>
          </div>
          <div class="field-container">
            <input type="email" id="email" name="email" placeholder="Email" required>
            <label for="email">Email</label>
          </div>
          <div class="field-container">
            <input type="text" id="subject" name="subject" placeholder="Subject" required>
            <label for="subject">Subject</label>
          </div>
          <div class="field-container">
            <textarea id="message" name="message" rows="10" placeholder="Message" required></textarea>
            <label for="message">Message</label>
          </div>
          <div class="g-recaptcha" data-sitekey="6LfH2-oiAAAAAO8yeRMVEugLESUVWaUe8qUtTNCn"
          aria-label="Please complete the reCAPTCHA to verify that you are not a robot."></div>
          <button type="submit">Send Message</button>
          <br>
          <small>*All fields are required</small>
        </form>
      </div>
    </div>
  </div>
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
    var subject = 'New message from JUANING.dev';
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

    // Send form data to Firebase Function endpoint
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://formsubmit.co/ajax/contact@juaning.dev');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
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

    // Prepare form data as JSON
    var formData = {
      'name': name,
      'email': email,
      'subject': subject,
      'message': message
    };

    // Convert form data to JSON string
    var jsonData = JSON.stringify(formData);

    // Send form data to Firebase Function endpoint
    xhr.send(jsonData);
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
