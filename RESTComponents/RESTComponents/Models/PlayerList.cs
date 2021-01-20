﻿using RESTComponents.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Newtonsoft.Json;

namespace RESTComponents.Models
{
    public class Filer
    {
        private static string separator = ";";
        private static string fileName = "posqwerty2.json";
        [JsonProperty("Players")]
        public List<Player> Players { get; set; }
        public List<Territory> getAllPoints()
        {
            if (!System.IO.File.Exists(fileName))
            {
                return new List<Territory>();
            }
            List<Territory> points = System.IO.File.ReadAllLines(fileName).Select(x =>
            {
                var p = x.Split(separator);
                int lat, lon;
                Int32.TryParse(p[0], out lat);
                Int32.TryParse(p[1], out lon);
                return new Territory() { Id = lat, Troops = lon };
            }).ToList();
            return points;
        }


        public Root LoadFiler()
        {
            using (StreamReader r = new StreamReader(fileName))
            {
                string json = r.ReadToEnd();
                //List<Item> items = JsonConvert.DeserializeObject<List<Item>>(json);
                return System.Text.Json.JsonSerializer.Deserialize<Root>(json);
            }
           
            
        }


    }

    public class PlayerList : IPlayerList
    {
        Dictionary<int, Player> players = new Dictionary<int, Player>();
        int currentId = 0;
        Object locker = new Object();
        public PlayerList()
        {
            int[] ll = { 1, 3, 11, 13, 15, 19, 20, 21, 30, 33, 34, 36, 37 };
            List<int> pt = new List<int>(ll);
            Player player1 = new Player();
            for(int i = 0; i < pt.Count; i++)
            {
                Territory t = new Territory();
                t.Id = pt[i];
                player1.territories.Add(t);
            }
            AddPlayer(player1);
            int[] ll1 = {4,5,6,14,17,22,23,24,25,27,28,32,40};
            List<int> pt1 = new List<int>(ll1);
            Player player2 = new Player();
            for (int i = 0; i < pt1.Count; i++)
            {
                Territory t1 = new Territory();
                t1.Id = pt1[i];
                player2.territories.Add(t1);
            }
            AddPlayer(player2);
            int[] ll2 = {2,7,8,9,10,12,16,18,26,29,31,35,38,39 };
            List<int> pt2 = new List<int>(ll2);
            Player buffor = new Player();
            for (int i = 0; i < pt2.Count; i++)
            {
                Territory t2 = new Territory();
                t2.Id = pt2[i];
                buffor.territories.Add(t2);
            }
            AddPlayer(buffor);

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
