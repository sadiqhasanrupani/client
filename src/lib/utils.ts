import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import axios from "axios";

export type HttpError = {
  info?: any;
  code?: any;
} & Error;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (cookieName: string) => {
  const value = Cookies.get(cookieName);
  return value;
};

// Utility function to get headers
const getHeaders = (showToken: boolean = true) => {
  const authTokenCookie = `Bearer ${getCookie("authToken")}`;

  type Headers = {
    Authorization?: string; // Change `authToken` to `Authorization`
    "Content-Type": string;
  };

  let headers: Headers = {
    Authorization: authTokenCookie, // Change `authToken` to `Authorization`
    "Content-Type": "application/json",
  };

  if (!showToken) {
    headers = {
      "Content-Type": "application/json",
    };
  }

  return headers;
};

// Reusable POST function
export const postRequest = async (
  url: string,
  data: Record<string, any>,
  showToken: boolean = true,
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}${url}`,
      data,
      { headers: getHeaders(showToken) },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Reusable GET function
export const getRequest = async (url: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}${url}`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error: unknown) {
    handleAxiosError(error);
  }
};

// Reusable DELETE function
export const deleteRequest = async (url: string, data: Record<string, any>) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}${url}`,
      {
        headers: getHeaders(),
        data: data,
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

function handleAxiosError(error: any) {
  if (error.response) {
    const errorData = error.response.data;
    const customError: HttpError = new Error(errorData.message);
    customError.info = errorData;
    customError.code = error.response.status;
    throw customError;
  } else {
    throw new Error("Please try again.");
  }
}
