import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SpeechToText from "@/share/SpeechToText";

jest.mock("@/hooks/useSpeech", () => {
  let isListening = false;
  const startListening = jest.fn(() => {
    isListening = true;
    return Promise.resolve();
  });
  const stopListening = jest.fn(() => {
    isListening = false;
    return Promise.resolve();
  });

  const useSpeech = () => ({
    isListening,
    transcript: { current: "" },
    startListening,
    stopListening,
    error: null,
  });

  return {
    __esModule: true,
    default: useSpeech,
  };
});

describe("SpeechToText Component", () => {
  test("1. input창에 값이 잘 입력되고 있는가?", () => {
    render(<SpeechToText />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input).toHaveValue("Hello");
  });

  test("2. button을 클릭시 title이 잘 변경되는가?", async () => {
    const { startListening } = require("@/hooks/useSpeech").default();
    const { rerender } = render(<SpeechToText />);
    
    const button = screen.getByTitle("녹음 시작");
    fireEvent.click(button);
    expect(startListening).toHaveBeenCalled();
    
    // 상태 변경 후 컴포넌트 리렌더링
    rerender(<SpeechToText />);
    
    await waitFor(() => {
      expect(screen.getByTitle("녹음 중지")).toBeInTheDocument();
    });
    fireEvent.click(button)
  });

  test("3. 녹음중에 키보드입력이 있다면 title이 잘 변경되는가?", async () => {
    const { stopListening } = require("@/hooks/useSpeech").default();
    const { rerender } = render(<SpeechToText />);
    
    const button = screen.getByTitle("녹음 시작");
    fireEvent.click(button);
    
    // 상태 변경 후 컴포넌트 리렌더링
    rerender(<SpeechToText />);
    
    await waitFor(() => {
      expect(screen.getByTitle("녹음 중지")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTitle("녹음 중지"))
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "A", code: "KeyA" });
    // 상태 변경 후 컴포넌트 리렌더링
    rerender(<SpeechToText />);
    await waitFor(() => {
      expect(screen.getByTitle("녹음 시작")).toBeInTheDocument();
    });
  });

  test("4. 재녹음시 기존 value값이 잘 보존되는가?", async () => {
    const { rerender } = render(<SpeechToText />);
    const input = screen.getAllByRole("textbox")[0]; // 첫 번째 텍스트 상자 선택
    fireEvent.change(input, { target: { value: "Existing value " } });
    const button = screen.getAllByTitle("녹음 시작")[0]; // 첫 번째 버튼 선택
    fireEvent.click(button);
    // 상태 변경 후 컴포넌트 리렌더링
    rerender(<SpeechToText />);
    await waitFor(() => {
      expect(screen.getByTitle("녹음 중지")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTitle("녹음 중지"));
    fireEvent.click(button);
    // 상태 변경 후 컴포넌트 리렌더링
    rerender(<SpeechToText />);
    await waitFor(() => {
      expect(input).toHaveValue("Existing value ");
    });
  });
});
