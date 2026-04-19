import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-100 w-full py-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 w-full max-w-screen-2xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="font-headline font-black text-stone-900 text-2xl tracking-tighter">
            KINETIC PRECISION
          </div>
          <p className="font-body text-sm tracking-wide text-stone-500">
            &copy; 2026 Kinetic Precision. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link
            href="#"
            className="font-body text-sm tracking-wide text-stone-500 hover:text-stone-800 transition-all hover:underline"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="font-body text-sm tracking-wide text-stone-500 hover:text-stone-800 transition-all hover:underline"
          >
            Legal
          </Link>
          <Link
            href="#"
            className="font-body text-sm tracking-wide text-stone-500 hover:text-stone-800 transition-all hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="font-body text-sm tracking-wide text-stone-500 hover:text-stone-800 transition-all hover:underline"
          >
            Sustainability
          </Link>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg">share</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
            <span className="material-symbols-outlined text-lg">public</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
