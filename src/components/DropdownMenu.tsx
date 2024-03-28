import { useEffect } from "react";
import { SessionProvider, useSession } from "../../services/Context/SessionContext";
import { useNavigate } from 'react-router-dom';
import type { User } from "../../services/Context/SessionContext";
import CloseIcon from "../icons/CloseIcon";
import SignIn from "../icons/SignIn";
import TranscriptionsList from "./TranscriptionsList";

interface DropdownMenuProps {
    user: User;
}

export default function DropdownMenu({ user }: DropdownMenuProps) {
    const {
        showSelectedTranscription,
        toggleShowMenu,
        showMenu,
        setShowMenu,
        handleClickOutside,
        showSignOutOption,
        signOutRef,
        userSignOut,
        toggleSignOutOptions,
    } = useSession();
    const navigate = useNavigate();

    // Navegar al inicio de sesión
    const goToSignIn = () => {
        navigate('inicioSesion')
    };

    // Saber el cambio de tamaño de la pantalla
    useEffect(() => {
        // Si la pantalla es mayor a 700px se oculta el menú desplegable
        const handleResize = () => {
            if (window.innerWidth > 800) {
                setShowMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);

        document.addEventListener('mousedown', handleClickOutside);

        // Limpieza del event listener cuando el componente se desmonta
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {showMenu ? (
                <section className="dropdown-menu fixed top-0 left-0 bottom-0 flex w-full bg-transparent overflow-y-auto z-10">
                    <div onClick={toggleShowMenu} className="flex-grow backdrop-filter backdrop-blur-xs flex flex-col p-3">
                        <button onClick={toggleShowMenu} className="hover:bg-[#333] rounded-lg p-1 w-fit self-end" title="Ocultar menú desplegable">
                            <span className="sr-only">Ocultar menú desplegable</span>
                            <CloseIcon width={24} height={24} />
                        </button>
                    </div>
                    <div className="flex flex-col dark:bg-[#171717] h-full w-[290px] p-4 justify-between">
                        <div className="flex justify-center">
                            <h3 className="text-center text-sm text-slate-200 w-4/5 border-b border-[#333] py-2">Historial de transcripciones</h3>
                        </div>
                        <section className="overflow-y-auto h-full">
                                <TranscriptionsList
                                    user={user}
                                    showSelectedTranscription={showSelectedTranscription}
                                    toggleShowMenu={toggleShowMenu}
                                    showMenu={showMenu}
                                />
                        </section>
                        <footer className="flex justify-end">
                            {user.role === 1 /*1 === authenticated*/ ? (
                                <>
                                    {showSignOutOption && (
                                        <div ref={signOutRef} className="absolute right-4 bottom-10 mt-2 w-40 bg-[#333] rounded-lg p-2 flex flex-col gap-y-1 shadow-lg shadow-black z-10">
                                            <button onClick={userSignOut} className="flex items-center gap-4 hover:bg-[#444] rounded-lg px-2 py-1">
                                                <span>Cerrar sesión</span>
                                            </button>
                                        </div>
                                    )}
                                    <button onClick={toggleSignOutOptions} type="button" className="flex items-center gap-4 hover:bg-[#333] rounded-lg px-2 py-1 mt-2">{user.email}</button>
                                </>
                            ) : (
                                <button onClick={goToSignIn} className="flex items-center gap-4 hover:bg-[#333] rounded-lg px-2 py-1 mt-2" >
                                    <span>Inicar sesión</span><SignIn width={18} height={18} />
                                </button>
                            )}
                        </footer>
                    </div>
                </section>
            ) : (
                <></>
            )}
        </>

    );
};