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

}
