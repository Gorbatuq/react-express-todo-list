import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { FilterButtons } from "../features/taskGroup/components/TaskGroupCard/FilterButtons";

describe("FilterButtons", () => {
  test("renders all filter buttons", () => {
    render(<FilterButtons currentFilter="all" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /All/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Completed/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Active/i })).toBeInTheDocument();
  });

  test("marks current filter as pressed", () => {
    render(<FilterButtons currentFilter="completed" onChange={() => {}} />);

    const completedButton = screen.getByRole("button", { name: /Completed/i });
    expect(completedButton).toHaveAttribute("aria-pressed", "true");
  });

  test("calls onChange when clicking a button", async () => {
    const handleChange = vi.fn();
    render(<FilterButtons currentFilter="all" onChange={handleChange} />);

    const activeButton = screen.getByRole("button", { name: /Active/i });
    await userEvent.click(activeButton);

    expect(handleChange).toHaveBeenCalledWith("active");
  });
});
