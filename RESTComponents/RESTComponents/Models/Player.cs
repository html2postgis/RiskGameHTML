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
        
    }
}
