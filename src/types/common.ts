import React from "react";

export interface PageProps {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export interface APIError {
  code: string;
  message: string;
  statusCode: number;
}
