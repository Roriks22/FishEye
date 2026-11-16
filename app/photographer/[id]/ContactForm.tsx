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
      <button type="button" onClick={() => setIsOpen(true)}>
        Contactez-moi
      </button>
      {isOpen && (
        <div className="contact-modal" onClick={() => setIsOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le formulaire"
            >
              x
            </button>

            <h2 id="contact-title">
              Contactez-moi <br />
              {photographerName}
            </h2>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firsName">Prénom</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              <div>
                <label htmlFor="lastName">Nom</label>
                <input type="text" id="lasttName" name="lastName" required />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div>
                <label htmlFor="message">Votre message</label>
                <textarea id="message" name="message" required />
              </div>
              <button type="submit">Envoyer</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
