import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AtlasPage from '@/AtlasPage';
import atlasJson from '../../data/normalized/atlas_public_records.json';
import type { AtlasRecord } from '@/data/atlasTypes';
import { summarizeInstitutions } from '@/lib/atlas';

const summaries = summarizeInstitutions(atlasJson as AtlasRecord[]);
const multiple = summaries.find((item) => item.records.length > 1)!;
const single = summaries.find((item) => item.records.length === 1)!;
const scroll = vi.fn();
const marker = (name: string) => screen.getByTitle(`Show records for ${name}`);

beforeEach(() => {
  scroll.mockClear();
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: scroll });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('atlas marker navigation', () => {
  it('focuses and highlights records, supports repeat clicks and switches institutions', () => {
    render(<AtlasPage />);
    fireEvent.click(marker(multiple.institutionName));
    expect(screen.getAllByText('Selected on map')).toHaveLength(multiple.records.length);
    expect(document.activeElement).toHaveTextContent(multiple.records[0].object_title);
    expect(scroll).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'start' });
    fireEvent.click(marker(multiple.institutionName));
    expect(scroll).toHaveBeenCalledTimes(2);
    fireEvent.click(marker(single.institutionName));
    expect(screen.getAllByText('Selected on map')).toHaveLength(1);
    expect(document.activeElement).toHaveTextContent(single.records[0].object_title);
  });

  it('preserves filters and clears highlights when filters change or reset', () => {
    render(<AtlasPage />);
    fireEvent.change(screen.getByLabelText('Institution'), { target: { value: multiple.institutionName } });
    fireEvent.click(marker(multiple.institutionName));
    expect(screen.getByLabelText('Institution')).toHaveValue(multiple.institutionName);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'no-such-record-xyz' } });
    expect(screen.queryByText('Selected on map')).not.toBeInTheDocument();
    expect(screen.getByText('No records match these filters.')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Clear filters'));
    fireEvent.click(marker(single.institutionName));
    fireEvent.click(screen.getByText('Clear filters'));
    expect(screen.queryByText('Selected on map')).not.toBeInTheDocument();
  });

  it('supports Enter and Space and respects reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    render(<AtlasPage />);
    fireEvent.keyDown(marker(single.institutionName), { key: 'Enter', keyCode: 13 });
    expect(document.activeElement).toHaveTextContent(single.records[0].object_title);
    fireEvent.keyDown(marker(multiple.institutionName), { key: ' ', keyCode: 32 });
    expect(screen.getAllByText('Selected on map')).toHaveLength(multiple.records.length);
    expect(scroll).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'start' });
  });
});
