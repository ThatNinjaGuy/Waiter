// let isSharing = false;
// const sharingQueue = [];

// export default const shareWithQueue = async (uri) => {
//   if (isSharing) {
//     return new Promise((resolve, reject) => {
//       sharingQueue.push({ uri, resolve, reject });
//     });
//   }

//   isSharing = true;
//   try {
//     await Sharing.shareAsync(uri);
//   } catch (error) {
//     console.error("Sharing failed:", error);
//     throw error;
//   } finally {
//     isSharing = false;
//     if (sharingQueue.length > 0) {
//       const nextShare = sharingQueue.shift();
//       shareWithQueue(nextShare.uri)
//         .then(nextShare.resolve)
//         .catch(nextShare.reject);
//     }
//   }
// };
