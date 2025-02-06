
import { Bell, BookOpenCheck, CirclePower, Cross, Eye, Flower, Home, MessageSquareMore, Search, Settings, Share, Share2, UserRound } from "lucide-react"
import pic from '../assets/images/pic.jpg'
import h7 from '../assets/images/h7.jpg'
import h4 from '../assets/images/h4.jpg'
import h5 from '../assets/images/h5.jpg'
import h6 from '../assets/images/h6.jpg'
import candle from '../assets/images/candle.png'
import { comment } from "postcss"



const K = {

    NAVLINKS : [
        {
            icon: <Home/>,
            text: 'Home',
            path: '/main'
           
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
            key: 'messages'
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

        
    ]
}

export default K