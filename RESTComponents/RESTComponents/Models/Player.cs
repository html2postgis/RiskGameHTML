using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RESTComponents.Helpers;

namespace RESTComponents.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Troops { get; set; }
        public List<Territory> territories { get; set; }
        
        public Player()
        {
            territories = new List<Territory>();
        }
        
    }
    public class helper
    {
        public int attackerid { get; set; }
        public int defenderid { get; set; }
        public int territoryid { get; set; }
    }
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
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


}
