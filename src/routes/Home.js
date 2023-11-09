import { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";

const Home = ({userObj}) => {
    const [nweet,setNweet]=useState("");//트윗 등록할 때 사용
    const [nweets,setNweets]=useState([]);//여태껏 등록된 모든 트윗을 조회할 때 사용

    useEffect(()=>{
        dbService.collection("nweets").onSnapshot((snapshot)=>{
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        })
    },[]);
    
    
    const onSubmit =async(event)=>{
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId:userObj.uid,
        });
        setNweet("");
    };

    const onChange = (event) =>{
        event.preventDefault();
        const {
            target:{value},
        }=event;
        setNweet(value);
    };

    return(
        <>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}/>
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet)=>( //map은 배열순회 함수이다. 여기서 nweet는 nweets에서 가져온 하나의 객체
                    <Nweet key={nweet.id} //각 엘리먼트를 식별하기 위해 id를 식별키로 사용
                    nweetObj={nweet}
                    isOwner={nweet.creatorId===userObj.uid}
                    />
                ))}
            </div>
        </>
    );
};

export default Home;