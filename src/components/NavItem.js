import Link from "next/link";

export default function NavItem({ label, href, active }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg transition cursor-pointer ${
        active
          ? "bg-indigo-600 text-white"
          : "hover:bg-white/10 text-gray-300"
      }`}
    >
      {label}
    </Link>
  );
}
