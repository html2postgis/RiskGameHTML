using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RESTComponents.Models;

namespace RESTComponents.Helpers
{
    public class RandomCalculator
    {
		public List<List<int>> calculateWinner(int attack, int defence)
		{
			var rnd = new Random();
			var attackers = new List<int>();
			var defencors = new List<int>();
			Console.WriteLine($"att {attack} + def {defence}");
			for (int i = 0; i < attack; i++)
			{
				attackers.Add(-1);
			}
			for (int i = 0; i < defence; i++)
			{
				defencors.Add(-1);
			}
			while (attackers.Count !=0 && defencors.Count != 0)
			{
				// it will return attackers.Count if  attackers.Count < 3
				var partOfAttackers = attackers.Take(3).ToList();
				var partOfDefencors = defencors.Take(2).ToList();
				for (int i = 0; i < partOfAttackers.Count; i++)
				{
					partOfAttackers[i]= rnd.Next(1, 7);
					attackers.RemoveAt(0);
				}
				for (int i = 0; i < partOfDefencors.Count; i++)
				{
					partOfDefencors[i] = rnd.Next(1, 7);
					defencors.RemoveAt(0);
				}
				//list.RemoveRange(0, Math.Min(3, list.Count));
				partOfAttackers.Sort();
				partOfAttackers.Reverse();

				partOfDefencors.Sort();
				partOfDefencors.Reverse();

				var result = new List<int>();
				if (partOfAttackers.Count >= partOfDefencors.Count)
                {
					for (int k = 0; k < partOfAttackers.Count ; k++)
					{
						
						if (k>=partOfDefencors.Count)
                        {
							for (int j = 0; j < partOfAttackers.Count - partOfDefencors.Count; j++)
							{
								result.Add(1);
							}
						}
						else if (partOfAttackers[k] <= partOfDefencors[k])
							result.Add(0);
						else 
							result.Add(1);
					}
				}
				else if (partOfAttackers.Count < partOfDefencors.Count)
				{
					for (int i = 0; i < partOfDefencors.Count; i++)
					{
						
						
						if (i >= partOfAttackers.Count)
						{
							for (int j = 0; j < partOfDefencors.Count - partOfAttackers.Count ; j++)
							{
								result.Add(0);
							}
						}
						else if (partOfAttackers[i] <= partOfDefencors[i])
							result.Add(0);
						else
							result.Add(1);
					}


				}
				for (int i = 0; i < partOfAttackers.Count; i++)
				{
					if (result[i] == 0)
					{
						partOfAttackers.RemoveAt(i);
					}
				}
				for (int i = 0; i < partOfDefencors.Count; i++)
				{
					if (result[i] == 1)
					{
						partOfDefencors.RemoveAt(i);
					}
				}
				if (partOfAttackers.Count !=0)
					attackers.AddRange(partOfAttackers);
				if (partOfDefencors.Count != 0)
					defencors.AddRange(partOfDefencors);


			}
			var resultList = new List<List<int>>();
			resultList.Add(attackers);
			resultList.Add(defencors);
			return resultList;
		}
		
		
		
		public int countTerritories(Root root, int playerId)
        {
			
			var counts = root.features.FindAll(x => x.properties.playerId==playerId);
			return counts.Count;
		}
		public List<Feature> selectPlayersTerritories(Root root, int playerId, int territoryId)
		{

			var counts = root.features.FindAll(x => x.properties.playerId == playerId);
			
			return counts;
		}
		public void AddTroop(Root root, int territoryId)
        {
			int tmp = root.features[territoryId-1].properties.troops + 1;
			root.features[territoryId - 1].properties.troops = tmp;

		}
		public void MoveTroop(Root root, int territoryId1, int territoryId2,int num)
		{
			int tmp1 = root.features[territoryId1 - 1].properties.troops - num;
			root.features[territoryId1 - 1].properties.troops = tmp1;
			int tmp2 = root.features[territoryId2 - 1].properties.troops + num;
			root.features[territoryId2 - 1].properties.troops = tmp2;
		}
	}

}
