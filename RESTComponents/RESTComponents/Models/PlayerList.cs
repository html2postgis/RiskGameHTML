using RESTComponents.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Models
{
    public class PlayerList : IPlayerList
    {
        Dictionary<int, Player> players = new Dictionary<int, Player>();
        int currentId = 0;
        Object locker = new Object();
        public PlayerList()
        {
            Player buffor = new Player();
            for(int i = 21; i <= 30; i++)
            {
                Territory t = new Territory();
                t.Id = i;
                buffor.territories.Add(t);
            }
            AddPlayer(buffor);
            Player player1 = new Player();
            for (int i = 31; i <= 40; i++)
            {
                Territory t1 = new Territory();
                t1.Id = i;
                player1.territories.Add(t1);
            }
            AddPlayer(player1);
            Player player2 = new Player();
            for (int i = 0; i <= 20; i++)
            {
                Territory t2 = new Territory();
                t2.Id = i;
                player2.territories.Add(t2);
            }
            AddPlayer(player2);

        }
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
            Player tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            return tmpPlayer;
        }

        public List<Player> GetPlayers()
        {
            return players.Values.ToList();
        }

        public Player Remove(int key)
        {
            Player tmpPlayer;
            players.TryGetValue(key, out tmpPlayer);
            if (players.Remove(key))
            {
                return tmpPlayer;
            }
            return null;
        }
        void Update(Player tmpPlayer)
        {
           players[tmpPlayer.Id] = tmpPlayer;
        }
        

    }
   
}
