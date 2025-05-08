const video = document.getElementById("video");
        const canvas = document.getElementById("canvas");
        const result = document.getElementById("result");

        let stream = null;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
            } catch (err) {
                alert("Camera access denied: " + err);
            }
        }

        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                video.srcObject = null;
            }
        }

        async function detectMoodUsingGemini(base64Image) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBMwa2US_eFzjkQHhUALEWp84tY9W7kB-A`, // **REPLACE WITH YOUR ACTUAL API KEY**
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: "What is the mood of this person? Respond only with one of: Happy, Excited, Neutral, Angry, Sad.",
                                    },
                                    {
                                        inlineData: {
                                            mimeType: "image/png",
                                            data: base64Image,
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();
            console.log("Gemini response:", data); 

            try {
                if (
                    data &&
                    data.candidates &&
                    data.candidates.length > 0 &&
                    data.candidates[0].content &&
                    data.candidates[0].content.parts &&
                    data.candidates[0].content.parts.length > 0 &&
                    data.candidates[0].content.parts[0].text
                ) {
                    return data.candidates[0].content.parts[0].text.trim();
                } else {
                    throw new Error("Invalid response structure from Gemini API");
                }
            } catch (err) {
                throw new Error("Error processing Gemini API response: " + err.message);
            }
        }

        // async function captureImage() {
        //     result.innerHTML = "Starting camera...";
        //     await startCamera();

        //     setTimeout(async () => {
        //         const context = canvas.getContext("2d");
        //         canvas.width = video.videoWidth;
        //         canvas.height = video.videoHeight;
        //         context.drawImage(video, 0, 0, canvas.width, canvas.height);

        //         const base64 = canvas.toDataURL("image/png").split(",")[1];
        //         result.innerHTML = "Detecting mood...";

        //         try {
        //             const mood = await detectMoodUsingGemini(base64);

        //             const movieMap = {
        //                 Happy: {
        //                     title: "Welcome",
        //                     poster:
        //                         "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR4aqGT0d_m20aT9GwiZtUqSVCCGWpGH9NFWmWUirmYr7gB6eIRn-ZhO1j7hbMCMvwosbbydQ",
        //                 },
        //                 Excited: {
        //                     title: "Inception",
        //                     poster:
        //                         "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQovCe0H45fWwAtV31ajOdXRPTxSsMQgPIQ3lcZX_mAW0jXV3kH",
        //                 },
        //                 Neutral: {
        //                     title: "Forrest Gump",
        //                     poster:
        //                         "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcScf5su68o8oOp0D89ESlb3_8RW2ge3ZWIPFv_OBVSObb680o3H",
        //                 },
        //                 Angry: {
        //                     title: "Gladiator",
        //                     poster:
        //                         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFabKsWv9ru_kpMttjPf2493GGI7L3LpW3XjgPTE9FyHdNDIwV",
        //                 },
        //                 Sad: {
        //                     title: "Inside Out",
        //                     poster:
        //                         "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR7IE8YJaJlh3CW-KYU745oE2WzjyvRgKwNyAwe73di_U0uuD5Q",
        //                 },
        //             };

        //             const movie = movieMap[mood] || movieMap["Neutral"];

        //             result.innerHTML = `
        //                 <h3>Mood Detected: ${mood}</h3>
        //                 <p>Recommended Movie: <strong>${movie.title}</strong></p>
        //                 <img src="${movie.poster}" alt="${movie.title} Poster" style="width:300px;margin-top:10px;">
        //             `;
        //         } catch (err) {
        //             result.innerHTML = "Error detecting mood. " + err.message;
        //             console.error(err);
        //         }

        //         stopCamera();
        //     }, 3000);
        // }


        async function captureImage() {
          result.innerHTML = "Starting camera...";
          await startCamera();
      
          setTimeout(async () => {
              const context = canvas.getContext("2d");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
              const base64 = canvas.toDataURL("image/png").split(",")[1];
              result.innerHTML = "Detecting mood...";
      
              try {
                  const mood = await detectMoodUsingGemini(base64);
      
                  const movieMap = {
                      Happy: {
                          name: "Welcome",
                          link: "https://www.primevideo.com/detail/0MJFLZHIV04F9V9V21RAY2Z8ZZ/",
                          thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/af13e1c59556eb143d2b213c9f95567677f409033d4c9619c553367d71bee982._SX1920_FMwebp_.jpg"
                      },
                      Sad: {
                          name: "Call me Bae",
                          link: "https://www.primevideo.com/detail/0TF2BODX83KZOWTP08NXFE897E/",
                          thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/0cb7ac74d1d6e8eb2e3d59aa5354359714eb54d84fcfaa616d9de19d64b492ca._SX1920_FMwebp_.jpg"
                      },
                      Excited: {
                          name: "Citadel Honey Bunny",
                          link: "https://www.primevideo.com/detail/0KYRVT4JDB957NXZO72E2MIFW5",
                          thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/51c2c75da778c109ccc33ff293ff48f0cccc60b18c3fef8a42afe2a80e07acac._SX1920_FMwebp_.jpg"
                      },
                      Neutral: {
                          name: "Farzi",
                          link: "https://www.primevideo.com/detail/0HDHQAUF5LPWOJRCO025LFJSJI",
                          thumbnail: "https://m.media-amazon.com/images/S/pv-target-images/8aed532f0875925f72c4012aab688ed409773ecbfb3b18e1a39cd9ad1a4dd485._SX1920_FMwebp_.jpg"
                      },
                      Angry: {
                          name: "Agneepath",
                          link: "https://www.primevideo.com/detail/0NU7IFXPL2WWSDHNGAR5Z1GUJE/",
                          thumbnail: "https://images-eu.ssl-images-amazon.com/images/S/pv-target-images/1863426056ae862def9a69ca76e8af54cdb6b8a5a2be1100e096e59b00060847._UX1920_.png"
                      }
                  };
      
                  const movie = movieMap[mood] || movieMap["Neutral"];
      
                  result.innerHTML = `
                      <h3>Mood Detected: <span style="color:#00e5ff;">${mood}</span></h3>
                      <p>Recommended Movie: <strong>${movie.name}</strong></p>
                      <a href="${movie.link}" target="_blank">
                          <img src="${movie.thumbnail}" alt="${movie.name} Poster" style="width:100%;max-width:300px;margin-top:10px;border-radius:10px;">
                      </a>
                  `;
              } catch (err) {
                  result.innerHTML = "Error detecting mood. " + err.message;
                  console.error(err);
              }
      
              stopCamera();
          }, 3000);
      }
      