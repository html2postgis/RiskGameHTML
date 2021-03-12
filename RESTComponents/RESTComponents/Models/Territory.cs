using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RESTComponents.Helpers;

namespace RESTComponents.Models
{
    public class Properties
    {
        public string name { get; set; }
        public int troops { get; set; }
        public int playerId { get; set; }
    }

   
    public class Geometry
    {
        public string type { get; set; }
        public List<List<List<object>>> coordinates { get; set; }
    }

    public class Feature
    {
        public string type { get; set; }
        public string id { get; set; }
        public Properties properties { get; set; }
        public Geometry geometry { get; set; }
    }

    public class Root
    {
        public string type { get; set; }
        public List<Feature> features { get; set; }
    }

    public class RootWrapper:IRoot
    {
        public Root myRoot { get; set; }
        public RootWrapper()
        {
            
        }
        public void AssignRoot(Root r)
        {
            myRoot = r;
            
        }
        public Root GetRoot()
        {
            return myRoot;
        }
    }
    public interface IRoot
    {
        public Root GetRoot();
        public void AssignRoot(Root r);
    }
    public class Message
    {

        public int originTerritoryId { get; set; }
        public int finalTerritoryId { get; set; }
        public int numOfTroops { get; set; }

    }
}
