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
			Debug.Log("Fire");
			Fire();
		}
	}

	void Fire () {

		float laserMaxLength = 10000;

		Vector3 muzzlePosition = GameObject.Find("Muzzle").transform.position;
		Vector3 direction = Quaternion.AngleAxis(- 90, Vector3.up) * GameObject.Find("Aim").transform.right;
		Vector3 laserTargetPosition = muzzlePosition + direction * laserMaxLength;

		Ray laserRay = new Ray (muzzlePosition, laserTargetPosition);

		RaycastHit hit;
		if (Physics.Raycast (laserRay, out hit)) {
			laserTargetPosition = hit.point;
		} 
		LineRenderer beam = GameObject.Find ("LaserBeam").GetComponent<LineRenderer> ();
		LaserBeamBehaviour beamBehaviour = GameObject.Find ("LaserBeam").GetComponent<LaserBeamBehaviour> ();




		beamBehaviour.Fire (muzzlePosition, laserTargetPosition);

		beam.SetPosition (0, muzzlePosition);
		beam.SetPosition (1, laserTargetPosition);

		GameObject impact = GameObject.Find ("Impact");
		impact.transform.position = laserTargetPosition;
		Detonator detonator = impact.GetComponent<Detonator> ();
		detonator.direction = laserTargetPosition;
		detonator.Explode ();



	}
}


