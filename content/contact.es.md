---
title: "Contáctame"
description: "Hugo, the world’s fastest framework for building websites"
date: "2022-11-11"
slug: "contacto"
noComment: true
noDate: true
---

<div class="contact-page">
  <div class="row">
    <div class="col">
      <h2 style="font-style: italic;">Hola, soy <span style="color:
        var(--bold-with-gold);">Juan Gómez</span>,<br>
        Desarrollador Full Stack Senior en Cuernavaca, Morelos, Mexico.</h2>
      <p>No dudes en contactarme si tienes más preguntas, ofertas de proyectos,
        necesitas ayuda para resolver un problema con tu sitio o arquitectura
        de servidor. Estoy disponible para trabajar por hora.</p>
    </div>
    <div class="col">
      <div class="form-container">
        <form
          id="contact-form"
          method="post"
          class="responsive-form"
        >
          <div class="field-container">
            <label for="name">Nombre*:</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="field-container">
            <label for="email">Email*:</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="field-container">
            <label for="subject">Asunto*:</label>
            <input type="text" id="subject" name="subject" required>
          </div>
          <div class="field-container">
            <label for="message">Mensaje*:</label>
            <textarea id="message" name="message" rows="10" required></textarea>
          </div>
          <div class="g-recaptcha" data-sitekey="6LfH2-oiAAAAAO8yeRMVEugLESUVWaUe8qUtTNCn"
          aria-label="Por favor, complete el reCAPTCHA para verificar que no eres un robot."></div>
          <button type="submit">Enviar Mensaje</button>
          <br>
          <small>*Campos requeridos</small>
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
        text: 'Por favor completa la verificación reCAPTCHA.'
      });

      return;
    }

    // Send form data to Mailgun API
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://formsubmit.co/ajax/contact@juaning.dev');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {

          Swal.fire({
            icon: 'success',
            title: '¡Gracias por contactarme!',
            text: 'Agradezco tu interés y personalmente te responderé tan pronto como sea posible.'
          });

          // Clear form fields
          document.getElementById('contact-form').reset();
          grecaptcha.reset();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oh no...',
            text: 'Lo siento, parece que algo salió mal con el envío. Te sugiero que lo intente de nuevo más tarde.'
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
      recaptchaContainer.setAttribute('aria-label', 'Esta es una respuesta de reCAPTCHA');
    }
  }

  // Create a new observer and specify what to observe
  const observer = new MutationObserver(addAriaLabelToRecaptcha);

  // Configure the observer to watch for changes in the target node's child list
  const config = { childList: true };

  // Start observing the target node for configured mutations
  observer.observe(document.body, config);
</script>
