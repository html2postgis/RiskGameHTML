using Nancy.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Models
{
    public class Filer
    {

        private static string fileName = "InitialMap.json";
        //private static string fileCopyName = "InitialMap_copy.json";



        public Root LoadFiler()
        {
            
            using (System.IO.StreamReader r = new StreamReader(fileName))
            {
                string json = r.ReadToEnd();
                //List<Item> items = JsonConvert.DeserializeObject<List<Item>>(json);
                
                return System.Text.Json.JsonSerializer.Deserialize<Root>(json);
            }


        }
        //public Root ChangesFiler(string tempFile)
        //{
        //    using (System.IO.StreamReader r = new StreamReader(tempFile))
        //    {
        //        string json = r.ReadToEnd();
        //        //List<Item> items = JsonConvert.DeserializeObject<List<Item>>(json);
               
        //        return System.Text.Json.JsonSerializer.Deserialize<Root>(json);

        //        //operations here 


                
        //    }


        //}
        //public void CopyFile()
        //{
        //    string sourceFile = fileName;
        //    string destinationFile = fileCopyName;
        //    if (File.Exists(destinationFile))
        //    {
        //        File.Delete(destinationFile);
        //    }
        //    try
        //    {
        //        File.Copy(sourceFile, destinationFile, true);
        //    }
        //    catch (IOException iox)
        //    {
        //        Console.WriteLine(iox.Message);
        //    }
        //}
        
        //public void SaveFiler(Root tmpRoot)
        //{
        //    // serialize JSON directly to a file
        //    string json = JsonConvert.SerializeObject(tmpRoot, Formatting.Indented);
        //    File.WriteAllText(fileCopyName, json);


        //}
        

    }
   
}
