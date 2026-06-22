import { byId, on } from '../utils/dom.js';
import { toast } from '../services/toast.js';

export function initNewsletterForm() {
  on(byId('newsletterForm'), 'submit', event => {
    event.preventDefault();
    const input = event.target.querySelector('input[type="email"]');
    const value = input?.value.trim() || '';
    if (!value || !value.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    toast('Subscribed successfully!', 'success');
    event.target.reset();
  });
}
