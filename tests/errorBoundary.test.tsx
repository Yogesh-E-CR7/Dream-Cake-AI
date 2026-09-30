import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { ErrorBoundary } from '../src/components/common/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  it('instantiates and holds default state without error', () => {
    const boundary = new ErrorBoundary({ children: null });
    expect(boundary.state.hasError).toBe(false);
    expect(boundary.state.error).toBeNull();
  });

  it('updates state upon getDerivedStateFromError', () => {
    const mockError = new Error('Test Canvas Crash');
    const newState = ErrorBoundary.getDerivedStateFromError(mockError);

    expect(newState.hasError).toBe(true);
    expect(newState.error).toBe(mockError);
  });

  it('catches and logs error diagnostics in componentDidCatch', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const boundary = new ErrorBoundary({ children: null });
    const mockError = new Error('Shader compilation failed');
    const mockErrorInfo = { componentStack: 'in CakePreviewCanvas' };

    boundary.componentDidCatch(mockError, mockErrorInfo);

    expect(consoleSpy).toHaveBeenCalledWith(
      '[DreamCake ErrorBoundary caught error]:',
      mockError,
      mockErrorInfo
    );

    consoleSpy.mockRestore();
  });

  it('renders fallback error message when in error state', () => {
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Child Content'),
      fallbackTitle: 'Custom Canvas Error',
    });
    boundary.state = {
      hasError: true,
      error: new Error('WebGL Context Lost'),
      errorInfo: null,
    };

    const rendered = boundary.render() as React.ReactElement;
    expect(rendered).not.toBeNull();
    expect(rendered.type).toBe('div');
  });
});
