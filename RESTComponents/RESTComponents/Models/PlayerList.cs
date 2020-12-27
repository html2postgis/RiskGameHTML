using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Models
{
    public class PlayerList :IPlayerList
    {
        Dictionary<int, Player> players = new Dictionary<int, Player>();
        int currentId = 0;
        Object locker = new Object();
        public bool AddPlayer(Player newPlayer)
        {
            lock (locker)
            {
                newPlayer.Id = currentId;
                players.Add(currentId++, newPlayer);
                return true;
            }
        }

        public Player Find(int key)
        {
            throw new NotImplementedException();
        }

        public List<Player> GetPlayers()
        {
            throw new NotImplementedException();
        }

        public Player Remove(int key)
        {
            throw new NotImplementedException();
        }
    }

}
