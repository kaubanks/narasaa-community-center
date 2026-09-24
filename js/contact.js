(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const success = form.querySelector(".form-success");
  const fields = ["name", "email", "subject", "message"];

  const setError = (name, message) => {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message || "";
  };

  const validators = {
    name: (v) => (v.trim().length < 2 ? "Please enter your full name." : ""),
    email: (v) =>
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? "Please enter a valid email address."
        : "",
    subject: (v) => (v.trim().length < 3 ? "Please add a subject." : ""),
    message: (v) =>
      v.trim().length < 10
        ? "Please write a message (at least 10 characters)."
        : "",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;

    fields.forEach((name) => {
      const input = form.elements.namedItem(name);
      const value = input && "value" in input ? String(input.value) : "";
      const error = validators[name](value);

      setError(name, error);

      if (error) valid = false;

      if (input && "setAttribute" in input) {
        input.setAttribute("aria-invalid", error ? "true" : "false");
      }
    });

    if (!valid) return;

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      form.reset();

      fields.forEach((name) => {
        setError(name, "");

        const input = form.elements.namedItem(name);

        if (input && "setAttribute" in input) {
          input.setAttribute("aria-invalid", "false");
        }
      });

      success?.classList.add("is-visible");
      success?.focus?.();

    } catch (error) {
      console.error("Formspree submission error:", error);

      if (success) {
        success.textContent =
          "Sorry, your message could not be sent. Please try again or contact us directly.";
        success.classList.add("is-visible");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });

  fields.forEach((name) => {
    const input = form.elements.namedItem(name);

    input?.addEventListener("input", () => {
      const value = "value" in input ? String(input.value) : "";
      setError(name, validators[name](value));
    });
  });
})();
