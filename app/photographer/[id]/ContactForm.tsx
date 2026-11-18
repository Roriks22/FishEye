"use client";

import { useState } from "react";

type ContactFormProps = {
  photographerName: string;
};

export default function ContactForm({ photographerName }: ContactFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const contactData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    console.log("Message de contact :", contactData);

    setIsOpen(false);
    event.currentTarget.reset();
  }

  return (
    <>
      <button
        type="button"
        className="contact-trigger-btn"
        onClick={() => setIsOpen(true)}
      >
        Contactez-moi
      </button>

      {isOpen && (
        <div className="contact-modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="contact-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="contact-modal-header">
              <h1 id="contact-title">
                Contactez-moi <br />
                <span>{photographerName}</span>
              </h1>
              <button
                type="button"
                className="contact-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le formulaire"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-field">
                <label htmlFor="firstName">Prénom</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Nom</label>
                <input type="text" id="lastName" name="lastName" required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-field">
                <label htmlFor="message">Votre message</label>
                <textarea id="message" name="message" rows={5} required />
              </div>
              <button type="submit" className="contact-submit-btn">
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
