"use client";

import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-8 border-t-2 border-pink-200 bg-linear-to-r from-pink-50 to-fuchsia-50 py-6">
      <div className="mx-auto max-w-lg px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-pink-900">
            Built by <span className="font-semibold">Mayank</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/msk1039"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-900"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a
              href="mailto:mayz@edbn.me"
              className="flex items-center gap-2 rounded-lg border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-700 transition-all hover:border-pink-300 hover:bg-pink-50 hover:text-pink-900"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
