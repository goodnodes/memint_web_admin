import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createEarnOffTxLg(userId, amount, txType) {
  const userRef = doc(db, "User", userId);
  const userData = await getDoc(userRef);
  const tokenLogRef = collection(db, "User", userId, "OffchainTokenLog");
  await addDoc(tokenLogRef, {
    amount,
    txType,
    createdAt: Timestamp.now(),
    from: "serverId",
    to: userId,
    balance: userData.data().tokenAmount,
  });
  await updateDoc(userRef, {
    tokenAmount: Math.round((userData.data().tokenAmount + amount) * 10) / 10,
  });
}

export async function addExp(userId) {
  const userRef = doc(db, "User", userId);
  // user 정보에서 meminStats 받아오기
  const userInfo = await getDoc(userRef).then((result) => {
    return result.data();
  });
  const meminStats = userInfo.meminStats;
  // 경험치가 5일때와 아닐때 동작 구분
  if (meminStats.exp === 5) {
    meminStats.exp = 0;
    meminStats.level = meminStats.level + 1;
  } else {
    meminStats.exp = meminStats.exp + 1;
  }
  // 유저 정보 업데이트 해준 후 토큰 H공식에 맞춰 지급
  await updateDoc(userRef, { ...userInfo, meminStats }).then(() => {
    createEarnOffTxLg(userId, meminStats.HumanElement / 10, "미팅 참여");
  });
}
