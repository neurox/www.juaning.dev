---
title: "Contáctame"
description: "Hugo, the world’s fastest framework for building websites"
date: "2022-11-11"
slug: "contacto"
noComment: true
noDate: true
---

<div class="form-container">
  <form
    action="https://formspree.io/f/mbjbqlbn"
    method="POST"
    class="responsive-form"
  >
    <div class="field-container">
      <label>
        Nombre*
        <input type="text" name="fname" required>
      </label>
    </div>
    <div class="field-container">
      <label>
        Apellidos*
        <input type="text" name="lname" required>
      </label>
    </div>
    <div class="field-container">
      <label>
        Email*
        <input type="email" name="email" required>
      </label>
    </div>
    <div class="field-container">
      <label>
        Mensaje*
        <textarea name="message" rows="5" required></textarea>
      </label>
    </div>
    <button type="submit">Enviar</button>
    <hr>
    <small>*Campos requeridos</small>
  </form>
</div>
