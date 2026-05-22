import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EvaluationForm from './EvaluationForm';

describe('EvaluationForm Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('renders the evaluation form with all initial elements', () => {
    render(<EvaluationForm onSubmit={jest.fn()} />);

    // Check title
    expect(screen.getByText('Évaluer la collaboration')).toBeInTheDocument();

    // Check labels
    expect(screen.getByText('Votre note')).toBeInTheDocument();
    expect(screen.getByText('Votre commentaire')).toBeInTheDocument();

    // Check input elements
    const textarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('');

    // Check star rating buttons (5 of them)
    const buttons = screen.getAllByRole('button');
    // 5 stars + 1 Cancel button + 1 Submit button = 7 buttons total
    const starButtons = buttons.filter(btn => !btn.textContent);
    expect(starButtons).toHaveLength(5);

    // Check action buttons
    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    const submitButton = screen.getByRole('button', { name: /envoyer l'évaluation/i });
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('submit button is disabled when inputs are invalid', () => {
    render(<EvaluationForm onSubmit={jest.fn()} />);
    const submitButton = screen.getByRole('button', { name: /envoyer l'évaluation/i });
    const textarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    const buttons = screen.getAllByRole('button');
    const starButtons = buttons.filter(btn => !btn.textContent);

    // 1. Initial state (both empty): should be disabled
    expect(submitButton).toBeDisabled();

    // 2. Only comment filled, no stars: should be disabled
    fireEvent.change(textarea, { target: { value: 'Great collaboration!' } });
    expect(submitButton).toBeDisabled();

    // 3. Clear comment and select star: should be disabled
    fireEvent.change(textarea, { target: { value: '' } });
    fireEvent.click(starButtons[3]); // Click 4th star (index 3)
    expect(submitButton).toBeDisabled();

    // 4. Both filled: should be enabled
    fireEvent.change(textarea, { target: { value: 'Great collaboration!' } });
    expect(submitButton).toBeEnabled();
  });

  test('submits successfully and calls onSubmit after delay', () => {
    const mockOnSubmit = jest.fn();
    render(<EvaluationForm onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    const buttons = screen.getAllByRole('button');
    const starButtons = buttons.filter(btn => !btn.textContent);
    const submitButton = screen.getByRole('button', { name: /envoyer l'évaluation/i });

    // Fill form
    fireEvent.change(textarea, { target: { value: 'Excellent travail !' } });
    fireEvent.click(starButtons[4]); // 5 stars (index 4)

    // Submit form
    fireEvent.click(submitButton);

    // Check loading state
    expect(screen.getByRole('button', { name: /envoi en cours\.\.\./i })).toBeInTheDocument();
    expect(textarea).toBeDisabled();
    
    // Fast-forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check that onSubmit was called with correct data
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      commentaire: 'Excellent travail !',
      note: 5,
    });

    // Check success screen is displayed
    expect(screen.getByText('Évaluation envoyée')).toBeInTheDocument();
    expect(screen.getByText(/Merci d'avoir pris le temps/i)).toBeInTheDocument();
  });

  test('allows leaving another evaluation after successful submission', () => {
    render(<EvaluationForm onSubmit={jest.fn()} />);

    const textarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    const buttons = screen.getAllByRole('button');
    const starButtons = buttons.filter(btn => !btn.textContent);
    const submitButton = screen.getByRole('button', { name: /envoyer l'évaluation/i });

    // Fill and submit form
    fireEvent.change(textarea, { target: { value: 'Super !' } });
    fireEvent.click(starButtons[3]); // 4 stars (index 3)
    fireEvent.click(submitButton);

    // Complete submit timer
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Click on reset button "Laisser une autre évaluation"
    const resetButton = screen.getByRole('button', { name: /laisser une autre évaluation/i });
    fireEvent.click(resetButton);

    // Check if the form is back and empty
    expect(screen.getByText('Évaluer la collaboration')).toBeInTheDocument();
    const newTextarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    expect(newTextarea.value).toBe('');
    expect(screen.getByRole('button', { name: /envoyer l'évaluation/i })).toBeDisabled();
  });

  test('clears form fields when Cancel button is clicked', () => {
    render(<EvaluationForm onSubmit={jest.fn()} />);

    const textarea = screen.getByPlaceholderText('Partagez votre avis sur cette collaboration...');
    const buttons = screen.getAllByRole('button');
    const starButtons = buttons.filter(btn => !btn.textContent);
    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    const submitButton = screen.getByRole('button', { name: /envoyer l'évaluation/i });

    // Fill form
    fireEvent.change(textarea, { target: { value: 'Quelque chose d\'incomplet' } });
    fireEvent.click(starButtons[2]); // 3 stars

    expect(submitButton).toBeEnabled();

    // Click Cancel
    fireEvent.click(cancelButton);

    // Check if fields are reset
    expect(textarea.value).toBe('');
    expect(submitButton).toBeDisabled();
  });
});
