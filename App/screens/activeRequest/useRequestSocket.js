import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setCurrentSpadeRetailers } from '../../redux/reducers/userDataSlice';
import { socket } from '../../utils/scoket.io/socket';

const useRequestSocket = (spadeId) => {
    // const [users, setUsers] = useState([]);
    const currentSpadeRetailer = useSelector(store => store.user.currentSpadeRetailer);
    const currentSpade = useSelector(store => store.user.currentSpade);
    const currentSpadeRetailers = useSelector(store => store.user.currentSpadeRetailers);

    // const  
    useEffect(() => {
        // const socket = io('http://your-server-address:3000');

        socket.emit('join', spadeId);

        console.log('Request connected with socket with id', spadeId);

        socket.on('updated retailer', (updatedUser) => {
            setCurrentSpadeRetailers((prevUsers) => {
                return prevUsers.map((user) =>
                    user._id === updatedUser._id ? updatedUser : user
                );
            });
        });

        const fetchRetailers = () => {
            axios.get(`https://genie-backend-meg1.onrender.com/chat/spade-chats`, {
                params: {
                    id: currentSpade._id,
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        // setRetailers(response.data);
                        console.log('all reatailers fetched from on socket screen', response.data);
                        dispatch(setCurrentSpadeRetailers(response.data));
                    }
                })
                .catch((error) => {
                    console.error('Error while fetching chats', error);
                });
        }
        fetchRetailers();

        return () => {
            socket.disconnect();
        };
    }, [spadeId]);

    return users;
};

export default useRequestSocket;
