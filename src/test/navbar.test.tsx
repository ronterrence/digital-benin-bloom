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

  it("keeps the map discoverable and marked active in Explore", () => {
    render(<Navbar />, {
      wrapper: ({ children }) => <MemoryRouter initialEntries={["/map"]}>{children}</MemoryRouter>,
    });

    const exploreButtons = screen.getAllByRole("button", { name: /Explore/ });
    expect(exploreButtons[0]).toHaveClass("text-primary");
    fireEvent.click(exploreButtons[0]);
    expect(screen.getByRole("link", { name: "Map" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    fireEvent.click(screen.getAllByRole("button", { name: /Explore/ })[1]);
    expect(screen.getAllByRole("link", { name: "Map" })).toHaveLength(2);
  });
});
