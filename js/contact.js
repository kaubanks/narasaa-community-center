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
      v.trim().length < 10 ? "Please write a message (at least 10 characters)." : "",
  };

  form.addEventListener("submit", (e) => {
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

    // Front-end only success state for static hosting.
    // Connect to Formspree, Netlify Forms, or a cPanel mail script later.
    form.reset();
    fields.forEach((name) => setError(name, ""));
    success?.classList.add("is-visible");
    success?.focus?.();
  });

  fields.forEach((name) => {
    const input = form.elements.namedItem(name);
    input?.addEventListener("input", () => {
      const value = "value" in input ? String(input.value) : "";
      setError(name, validators[name](value));
    });
  });
})();
