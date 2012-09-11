﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using Videos.SapoServices.Utils;
using Videos.StsServiceReference;
using Videos.VideosServiceReference;
using Windows.Data.Xml.Dom;
using Windows.Networking.BackgroundTransfer;
using Windows.Storage;
using Windows.Storage.Streams;

namespace Videos.SapoServices
{
    public class VideosServiceClient
    {
        private const string AddVideoPostUri = "http://upload.videos.sapo.pt/upload_token.html";
        private readonly VideosSoapSecureClient _client;
        public string Username { get; set; }
        public string Password { get; set; }
        public string AccessKey { get; set; }

        public VideosServiceClient(string username, string password, string accessKey)
        {
            Username = username;
            Password = password;
            AccessKey = accessKey;
            this._client = new VideosSoapSecureClient();
        }

        private static async Task<UploadOperation> CreateUploadOperationForCreateVideo(
            IStorageFile file, string token, BackgroundUploader uploader)
        {
            const string boundary = "videoboundary";

            List<BackgroundTransferContentPart> parts = new List<BackgroundTransferContentPart>();

            BackgroundTransferContentPart metadataPart = new BackgroundTransferContentPart("token");

            metadataPart.SetText(token);
            //metadataPart.SetText("iamatoken");
            parts.Add(metadataPart);

            BackgroundTransferContentPart videoPart = new BackgroundTransferContentPart("content_file", file.Name);
            videoPart.SetFile(file);
            videoPart.SetHeader("Content-Type", file.ContentType);
            parts.Add(videoPart);

            return
                await uploader.CreateUploadAsync(
                    new Uri(AddVideoPostUri),
                    parts,
                    "form-data",
                    boundary);
        }

        private static string GetResponseMessage(UploadOperation uploadOperation)
        {
            ResponseInformation responseInformation = uploadOperation.GetResponseInformation();

            //uint contentLength = Convert.ToUInt32(responseInformation.Headers["Content-Length"]);

            uint contentLength = (uint)uploadOperation.Progress.BytesReceived;

            uint statusCode = responseInformation.StatusCode;

            IInputStream resultStreamAt = uploadOperation.GetResultStreamAt(0);

            IBuffer result = resultStreamAt.ReadAsync(
                new Windows.Storage.Streams.Buffer(contentLength),
                contentLength,
                InputStreamOptions.None).GetResults();

            Stream responseStream = result.AsStream();

            XDocument xDocument = XDocument.Load(responseStream);

            foreach (XElement xe in xDocument.Root.Descendants())
            {
                if (xe.Name.LocalName.Equals("Ok"))
                {
                    return "SUCCESS";
                }
                if (xe.Name.LocalName.Equals("Error"))
                {
                    return xe.Value;
                }
            }
            return "Unspecified error submiting video";
        }

        public async Task<string> CreateVideoAsync(IStorageFile file, Video v)
        {
            VideoSubmition videoSubmition = new VideoSubmition
                                                {
                                                    Tags = v.Tags,
                                                    Title = v.Title,
                                                    Synopse = v.Synopse
                                                };
            
            Video createdVideo = null;
            try
            {


                using (EnsureCredentialsUseContext context = new EnsureCredentialsUseContext(
                        this.Username, this.Password, this.AccessKey, _client))
                {
                    createdVideo = await this._client.AddVideoPostAsync(videoSubmition, null);


                }
            }
            catch (FaultException faultException)
            {
                MessageFault messageFault = faultException.CreateMessageFault();

                if (messageFault.HasDetail)
                {
                    string innerErrorXml;
                    using (var xmlReader = messageFault.GetReaderAtDetailContents())
                    {
                        innerErrorXml = xmlReader.ReadInnerXml();
                    }
                    if (innerErrorXml != null)
                        throw new Exception(innerErrorXml);
                    throw;
                }
            }
            var stsClient = new STSSoapSecureClient();
            StsServiceReference.ESBCredentials credentials = new StsServiceReference.ESBCredentials
                                                                 {
                                                                     ESBUsername = this.Username,
                                                                     ESBPassword = this.Password,
                                                                     ESBTokenExtraInfo = createdVideo.Randname
                                                                 };
            string token = await stsClient.GetTokenAsync(credentials, false);

            BackgroundUploader uploader = new BackgroundUploader();

            UploadOperation uploadOperation =
                await VideosServiceClient.CreateUploadOperationForCreateVideo(file, token, uploader);

            await uploadOperation.StartAsync();

            return GetResponseMessage(uploadOperation);
        }

        public async void DeleteVideoAsync(string randname)
        {
            using (EnsureCredentialsUseContext context = new EnsureCredentialsUseContext(
                        this.Username, this.Password, this.AccessKey, _client))
            {
                await this._client.DeleteVideoAsync(randname, null, null);
            }
        }
    }
}
