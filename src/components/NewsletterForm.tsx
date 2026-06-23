import { useState } from 'react';
import { useToast } from '../services/toast-context';

export default function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!value || !value.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    toast('Subscribed successfully!', 'success');
    setEmail('');
  };

  return (
    <form className="newsletter-form" id="newsletterForm" noValidate onSubmit={submit}>
      <input
        type="email"
        className="newsletter-input"
        placeholder="Email"
        aria-label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn-subscribe">
        Subscribe
      </button>
    </form>
  );
}
