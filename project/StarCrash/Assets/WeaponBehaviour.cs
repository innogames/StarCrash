using UnityEngine;
using System.Collections;

public class WeaponBehaviour : MonoBehaviour {

	GUIText weaponAmmoText;
	public int ammo = 100;

	// Use this for initialization
	void Start () {
		weaponAmmoText = GameObject.Find ("GUI").GetComponent<GUIText> ();

	
	}
	
	// Update is called once per frame
	void Update () {
		weaponAmmoText.text = "Ammo " + ammo.ToString();
	}
}
