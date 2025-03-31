
import { Bell, BookOpenCheck, CirclePower, Cross, Eye, Flower, Home, MessageSquareMore, Search, Settings, Share, Share2, UserRound } from "lucide-react"
import pic from '../assets/images/pic.jpg'
import h7 from '../assets/images/h7.jpg'
import h4 from '../assets/images/h4.jpg'
import candle from '../assets/images/candle.png'




const K = {

    NAVLINKS : [
        {
            icon: <Home/>,
            text: 'Home',
            path: '/'
           
        },
        {
            icon: <Search/>,
            text: 'Explore',
            key: 'explore'
           
        },
        {
            icon: <Bell/>,
            text: 'Notification',
            key: 'notification'
        },
        {
            icon: <MessageSquareMore/>,
            text: 'Messages',
            key: 'messages',
            
        },
        {
            icon: <CirclePower/>,
            text: 'Logout',
            path: '/'
            
        },
    ],


    POST : [
        {
            pf: [pic],
            name: 'Janice Griffith',
            comment: 'Rest well Grandpa',
            image: [h7],
            light: [candle],
            views: <Eye/>,
            tribute: <Cross/>,
            Guestbook: <BookOpenCheck/>,
            donate: <Flower/>,
            share: <Share2/>
        },
        {
            pf: [pic],
            name: 'Janice Griffith',
            comment: 'Rest well Grandpa',
            image: [h4],
            light: [candle],
            views: <Eye/>,
            tribute: <Cross/>,
            Guestbook: <BookOpenCheck/>,
            donate: <Flower/>,
            share: <Share2/>
        },
        {
            pf: [pic],
            name: 'Janice Griffith',
            comment: 'Rest well Grandpa',
            image: [h4],
            light: [candle],
            views: <Eye/>,
            tribute: <Cross/>,
            Guestbook: <BookOpenCheck/>,
            donate: <Flower/>,
            share: <Share2/>
        },
        {
            pf: [pic],
            name: 'Janice Griffith',
            comment: 'Rest well Grandpa',
            image: [h7],
            light: [candle],
            views: <Eye/>,
            tribute: <Cross/>,
            Guestbook: <BookOpenCheck/>,
            donate: <Flower/>,
            share: <Share2/>
        },
        {
            pf: [pic],
            name: 'Janice Griffith',
            comment: 'Rest well Grandpa',
            image: [h7],
            light: [candle],
            views: <Eye/>,
            tribute: <Cross/>,
            Guestbook: <BookOpenCheck/>,
            donate: <Flower/>,
            share: <Share2/>
        },

        
    ],

    NOTIFICATIONS : [
        { 
            id: 1,
          name: "Alice", 
          avatar: "https://i.pravatar.cc/40?img=1", 
          message: "sent you a commented on your post."
        },

        { 
          id: 2, 
          name: "Bob", 
          avatar: "https://i.pravatar.cc/40?img=2", 
          message: "liked your post."
        },

        {
          id: 3, 
          name: "Charlie", 
          avatar: "https://i.pravatar.cc/40?img=3", 
          message: "commented on your photo." 
        },
        {
          id: 4, 
          name: "Asmasi", 
          avatar: "https://i.pravatar.cc/40?img=3", 
          message: "commented on your photo." 
        },
        {
          id: 5, 
          name: "Faako", 
          avatar: "https://i.pravatar.cc/40?img=3", 
          message: "commented on your photo." 
        },
    ], 

    USERS : [
        { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/40?img=1" },
        { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/40?img=2" },
        { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/40?img=3" },
    ]
}

export default K