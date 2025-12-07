import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="page-wrapper flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-foreground-muted mb-8">
          Page not found
        </p>
        <Link href="/">
          <button className="btn btn-primary btn-lg">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
