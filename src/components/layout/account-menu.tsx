"use client";

import Link from "next/link";
import { useRef } from "react";

import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { signOutProfessional } from "@/lib/data/mutations";

interface AccountMenuProps {
  userName: string;
  roleLabel: string;
  profileHref: string;
  settingsHref: string;
}

/**
 * Account menu (Figma "Account menu dropdown"). Uses the native <dialog>
 * modal so focus is contained, Escape closes it and the backdrop is inert.
 */
export function AccountMenu({ userName, roleLabel, profileHref, settingsHref }: AccountMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  const itemClass =
    "flex min-h-11 w-full items-center justify-between rounded-tulay-8 px-3 text-left text-sm hover:bg-canvas";

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label="Open account menu"
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-tulay-8 hover:bg-canvas"
      >
        <MenuIcon />
      </button>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a pointer shortcut; Escape is handled natively by <dialog>. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="account-menu-title"
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes the menu.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 mt-[88px] ml-4 w-[min(360px,calc(100vw-2rem))] rounded-tulay-16 border border-secondary-100 bg-surface p-4 text-primary shadow-xl backdrop:bg-primary/40 sm:ml-6"
      >
        <div className="flex items-center justify-between">
          <h2 id="account-menu-title" className="text-xl font-medium">
            Your account
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close account menu"
            className="inline-flex size-11 items-center justify-center rounded-tulay-8 hover:bg-canvas"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <p className="mt-2 text-sm leading-6">
          {userName} · {roleLabel}
        </p>
        <hr className="my-2 border-secondary-100" />
        <ul className="flex flex-col gap-2">
          <li>
            <Link href={profileHref} onClick={close} className={itemClass}>
              Edit profile <span aria-hidden="true">›</span>
            </Link>
          </li>
          <li>
            <Link href="/login" onClick={close} className={itemClass}>
              Switch account <span aria-hidden="true">›</span>
            </Link>
          </li>
          <li>
            <Link href={settingsHref} onClick={close} className={itemClass}>
              Settings <span aria-hidden="true">›</span>
            </Link>
          </li>
          <li>
            <form action={signOutProfessional}>
              <button type="submit" className={`${itemClass} text-danger`}>
                Log out
              </button>
            </form>
          </li>
        </ul>
      </dialog>
    </>
  );
}
