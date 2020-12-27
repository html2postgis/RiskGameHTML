using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RESTComponents.Helpers
{
    public class BattleCalculator
    {
		public void calculations(int attack, int defence)
		{
			var rnd = new Random();
			var attackers = new List<int>();
			var defencors = new List<int>();
			
			for (int i = 0; i < attack; i++)
			{
				attackers.Add(-1);
			}
			for (int i = 0; i < defence; i++)
			{
				defencors.Add(-1);
			}
			while (attackers != null && defencors != null)
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
						if (partOfAttackers[k] <= partOfDefencors[k])
							result.Add(0);
						if (k>=partOfDefencors.Count)
                        {
							for (int j = 0; j < partOfAttackers.Count - partOfDefencors.Count; j++)
							{
								result.Add(1);
							}
						}
						else
							result.Add(1);
					}
				}
				else if (partOfAttackers.Count < partOfDefencors.Count)
				{
					for (int i = 0; i < partOfDefencors.Count; i++)
					{
						if (partOfAttackers[i] <= partOfDefencors[i])
							result.Add(0);
						
						else if (i >= partOfAttackers.Count)
						{
							for (int j = 0; j < partOfDefencors.Count - partOfAttackers.Count ; j++)
							{
								result.Add(0);
							}
						}
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
				attackers.AddRange(partOfAttackers);
				defencors.AddRange(partOfDefencors);


			}
		}
	}
}
