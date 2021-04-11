import React, {
	createContext,
	useContext,
	useMemo,
	useState,	
	useEffect,
	useCallback,
} from 'react';
import openSocket from 'socket.io-client';

const WSAPI_URL = 'http://localhost:3002';

const WSockets = createContext({});
export const useSockets = () => useContext(WSockets);

export const WSocketsProvider = ({ children }) => {
	const [socket, setSocket] = useState(undefined);	

	useEffect(() => {
		if (!socket) {	
			console.log("set socket");		
			const sock = openSocket(WSAPI_URL);	
			const onConnect = sock.on('connect', () => { 
				console.log("set socket");
				setSocket(sock);
			});
			return sock.off('connect', onConnect);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const sendInstruction = useCallback((key) => {
		socket.emit('instruction', key);
	}, [socket]);

	const value = useMemo(() => ({
		socket,
		sendInstruction,
	}), [
		socket,
		sendInstruction,
	]);

	return (
		<WSockets.Provider value={value}>
			{children}
		</WSockets.Provider>
	);
};