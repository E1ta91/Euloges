import { Menu, X } from "lucide-react";

export default function Drawer({ children, isOpen, setIsOpen }) {
    return (
        <main
            className={
                "fixed overflow-hidden z-50  inset-0 transform ease-in-out h-screen flex justify-end" +
                (isOpen
                    ? " transition-opacity opacity-100 duration-500 translate-x-0"
                    : " transition-all delay-500 opacity-0 translate-x-full")
            }
        >
            <section className="w-[75vw] md:w-[50vw] lg:w-[30vw] bg-gray-400/95 h-[100vh] shadow-lg">
                <article className="relative pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
                    <header className="p-4 flex items-center text-black justify-between">
                        <span className="font-bold text-lg">Menu</span>
                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </header>
                    {children}
                </article>
            </section>
        </main>
    );
}
