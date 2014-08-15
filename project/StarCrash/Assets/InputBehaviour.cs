using UnityEngine;
using System.Collections;

public class InputBehaviour : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetMouseButton(0)) { 


			/*Ray ray = Camera.main.ScreenPointToRay (Input.mousePosition);           
			RaycastHit hit;
			if (Physics.Raycast (ray, out hit)) {

			}
			Debug.Log(ray.direction);
			Debug.DrawLine(ray.origin, ray.origin + ray.direction * 100, Color.green, 100, false);*/

			Fire();
		}
	}

	void Fire () {

		float laserLength = 10000;

		Vector3 muzzlePosition = GameObject.Find("Muzzle").transform.position;
		Vector3 direction = Quaternion.AngleAxis(- 90, Vector3.up) * GameObject.Find("Player").transform.right;
		Vector3 laserTargetPosition = muzzlePosition + direction * laserLength;

		Ray laserRay = new Ray (muzzlePosition, laserTargetPosition);

		RaycastHit hit;
		if (Physics.Raycast (laserRay, out hit)) {
			laserTargetPosition = hit.point;
		} 



		Debug.DrawLine(muzzlePosition, laserTargetPosition, Color.blue, 0.1f, true);

	}
}


