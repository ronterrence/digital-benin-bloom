import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders the grouped navigation labels", () => {
    render(<Navbar />, { wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter> });

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    for (const group of ["Listen", "Explore", "Museums", "Context", "About"]) {
      expect(screen.getAllByRole("button", { name: new RegExp(group) }).length).toBeGreaterThan(0);
    }
  });

  it("reveals grouped links and highlights the active page", () => {
    render(<Navbar />, {
      wrapper: ({ children }) => <MemoryRouter initialEntries={["/atlas"]}>{children}</MemoryRouter>,
    });

    expect(screen.getAllByRole("button", { name: /Explore/ })[0]).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getAllByRole("button", { name: /Explore/ })[0]);

    expect(screen.getByRole("link", { name: "Atlas" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Archive" })).toBeInTheDocument();
  });
});
