import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-6 px-6 sm:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* ── COPYRIGHT ── */}
            <section className="text-sm sm:text-base text-gray-400 text-center sm:text-left">
                © {year} <span className="text-yellow-500 font-semibold">LMS</span> | All rights reserved
            </section>

            {/* ── SOCIAL ICONS ── */}
            <section className="flex items-center gap-5 text-2xl">
                <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-all duration-300">
                    <BsFacebook />
                </a>
                <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-all duration-300">
                    <BsInstagram />
                </a>
                <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-all duration-300">
                    <BsLinkedin />
                </a>
                <a href="" target="_blank" rel="noreferrer" className="hover:text-yellow-500 transition-all duration-300">
                    <BsTwitter />
                </a>
            </section>

        </footer>
    );
}

export default Footer;